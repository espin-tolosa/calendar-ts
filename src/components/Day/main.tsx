import { styles } from "@/components/Day/tw";
import { EventsThrower } from "@/components/EventsThrower/main";
import { memo, useEffect, useLayoutEffect, useRef } from "react";
import { DateService } from "@/utils/Date";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import { useIsDragging } from "@/hooks/useIsDragging";
import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import {
  useTemporaryEvent,
  useTemporaryEventDispatcher,
} from "@/globalStorage/temporaryEvents";
import { fetchEvent_Day } from "@/utils/fetchEvent";
import { CustomValues } from "@/customTypes";
import { useSetEventSelected } from "@/globalStorage/eventSelected";
import { event } from "@/interfaces";

type WithChildren<T = {}> = T & { children?: React.ReactNode };
type IDayProps = WithChildren<{
  daynumber: number;
  fullDate: string;
  start: string;
  end: string;
  isLocked: boolean;
  isWeekend: boolean;
}>;

// Used Context in Day Component:
//
// cDayLock
// cDayLockDispatcher
// cUseLocalUserPreferences
// cEventSelected
// cSetEventSelected
// cControllerState - start,end
// cControllerState - id,client,job

export function IDay({
  children,
  daynumber,
  fullDate,
  start,
  end,
  isLocked,
  isWeekend,
}: IDayProps) {
  const eventDispatcher = useEventDispatch();
  const tempDay = String(daynumber);
  const dayPadd = daynumber < 10 ? `0${tempDay}` : tempDay;
  const componentName = "Day";
  //console.info("Renderer " + componentName + " : " + fullDate);
  useEffect(() => {
    //console.info("Use Effect " + componentName + " : " + fullDate);
  }, []);
  useLayoutEffect(() => {
    //console.info("Use Layout of " + componentName + " : " + fullDate);
  }, []);

  const setEventController = useSetEventSelected();
  //dnd
  const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const isSet = useRef(CustomValues.nullEvent);
  const dayDivRef = useRef<HTMLDivElement>(null);

  //const { id } = useControllerState();
  const events = useEventState(fullDate);

  if (fullDate === "2022-03-24") {
    //console.log("events for day", fullDate);
    //console.log(events);
  }

  const dispatchControllerDates = useControllerDispatchDates();
  const isDragging = useIsDragging();

  const isSelected = (start: string, today: string, end: string) => {
    const left = DateService.DaysFrom(start, today);
    const right = DateService.DaysFrom(end, today);

    if (left >= 0 && right <= 0) {
      return true;
    }
    return false;
  };

  const isToday = fullDate === DateService.FormatDate(DateService.GetDate());

  return (
    <styles.contain
      id={`day-${fullDate}`}
      $isLock={isLocked}
      $isWeekend={isWeekend}
      $isSelected={isSelected(start, fullDate, end)}
      ref={dayDivRef}
      onClick={async () => {
        if (isDragging.state || isLocked || isWeekend) {
          return;
        }

        //
        const newEvent = {
          id: 100000,
          client: "default",
          job: "default",
          start: fullDate,
          end: fullDate,
        };
        eventDispatcher({
          type: "update",
          payload: [newEvent],
        });

        const FetchClosure = () => {
          const Max_Attempts = 10;

          const callFetch = async () => {
            try {
              const data = await fetchEvent_Day("POST", newEvent);
              return { status: true, data };
            } catch (e: any) {
              return { status: false, data: [] };
            }
          };

          const callManager = async (currentAttempt = 1) => {
            let result = await callFetch();
            setTimeout(async () => {
              if (!result.status && currentAttempt < Max_Attempts) {
                return callManager(++currentAttempt);
              }
              //Handle the result in case of succed or wasted time, first remove temporal event
              eventDispatcher({
                type: "delete",
                payload: [newEvent],
              });
              //then, commit database response if status is ok
              result.status &&
                eventDispatcher({
                  type: "update",
                  payload: result.data,
                });

              return;
            }, 200);
          };

          return callManager;
        };

        const caller = FetchClosure();
        caller();

        /*
  return async () => {
    const deleteResourceInAPI = async () => {
      const result = await fetchEvent("DELETE", eventSelected!);
      if (result.status === 204) {
        dispatchController({
          type: "setController",
          payload: { id: 0, client: "", job: "" },
        });
        dispatchControllerDates({
          type: "clearDates",
        });
        SetEventSelected(null);
      }

      return result.status;
    };

    const MAX_ATTEMPTS = 10;
    const success = (code: number) => code === 204;

    eventDispatcher({
      type: "delete",
      payload: [eventSelected!],
    });

    //This try to fetch 10 times before refresh the web page

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      try {
        const status = await deleteResourceInAPI();
        if (success(status)) {
          break;
        }
      } catch (e) {}
      if (i === MAX_ATTEMPTS - 1) {
        // It migth happen
        alert("Something went wrong, unable to delete event");

        //First strategy, force to refresh the page

        window.location.reload();

        //Second strategy, clear the state and contine

        //        eventDispatcher({
        //          type: "appendarray",
        //          payload: [eventSelected!],
        //        });
        //        dispatchController({
        //          type: "setController",
        //          payload: { id: 0, client: "", job: "" },
        //        });
        //        dispatchControllerDates({
        //          type: "clearDates",
        //        });
        //        SetEventSelected(null);
      }
    }
  };

*/

        //    const dbState2: Array<event> = [];
        //    //const dbResponse: Array<event> = await result.text();

        //    //This is the way I have to replace the Id of an event, since the action "replacebyid" uses the id to change the other fields, I can't use it to replace the id itself
        //    eventDispatcher({
        //      type: "delete",
        //      payload: [newEvent],
        //    });
        //    eventDispatcher({
        //      type: "syncDB",
        //      payload: dbState2,
        //    });

        //

        //     if (start === fullDate && end === fullDate) {
        //       setEventController(null);
        //     }
      }}
      onDragEnter={(e) => {
        if (temporaryEvent.end === fullDate) {
          return;
        }
        const isRewind =
          DateService.DaysFrom(temporaryEvent.start, fullDate) < 0;
        const newEvent = { ...temporaryEvent };
        if (isRewind) {
          newEvent.start = fullDate;
        } else {
          newEvent.end = fullDate;
        }
        eventDispatcher({
          type: "update",
          payload: [newEvent],
        });
        fetchEvent_Day("PUT", newEvent);
        temporaryEventDispatcher(newEvent);
      }}
      onMouseUp={() => {}}
    >
      <styles.header
        $isLock={isLocked}
        title={(() => {
          return (isLocked ? "Unlock " : "Lock ") + `day: ${dayPadd}`;
        })()}
        $isWeekend={isWeekend}
      >
        <styles.daySpot $isToday={isToday}>{dayPadd}</styles.daySpot>
      </styles.header>

      {true ? <EventsThrower day={fullDate} /> : <></>}
    </styles.contain>
  );
}
const isSelected = (start: string, today: string, end: string) => {
  const left = DateService.DaysFrom(start, today);
  const right = DateService.DaysFrom(end, today);

  if (left >= 0 && right <= 0) {
    return true;
  }
  return false;
};

export const MemoIDay = memo(IDay, (prev, next) => {
  const prevSelection = isSelected(prev.start, prev.fullDate, prev.end);
  const nextSelection = isSelected(next.start, next.fullDate, next.end);

  const datesSelectionEqual = prevSelection === nextSelection;

  const isLockedEqual = prev.isLocked === next.isLocked;

  const showWeekendEqual = prev.isWeekend === next.isWeekend;

  return datesSelectionEqual && isLockedEqual && showWeekendEqual;
});
