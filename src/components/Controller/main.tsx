import React, { useEffect, useRef } from "react";
import * as tw_Controller from "./tw";
import { useEventDispatch, useEventState } from "@/hooks/useEventsState";
import tw from "tailwind-styled-components";
import {
  useControllerDispatch,
  useControllerState,
} from "@/hooks/useController";
import { DateService } from "@/utils/Date";
import { isReadyToSubmit } from "@/utils/ValidateEvent";
import { useLocalUserPreferencesContext } from "@/hooks/useLocalUserPreferences";
import { useListenWindowSize } from "@/hooks/useResponsiveLayout";
import { useControllerStateDates } from "@/hooks/useControllerDate";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import { scrollToDay } from "@/utils/scrollToDay";
import { fetchEvent } from "@/utils/fetchEvent";
import { useGethCancel, useGethDeleteEvent } from "@/api/handlers";
import {
  useEventSelected,
  useSetEventSelected,
} from "@/globalStorage/eventSelected";

const CreateEvent = () => {
  const eventSelected = useEventSelected();
  const { id, client, job } = useControllerState();
  const { start, end } = useControllerStateDates();
  const setEventController = useSetEventSelected();
  const eventState = useEventState();
  const hCancelClose = useGethCancel();
  const hDeleteClose = useGethDeleteEvent();

  /*  parallel change consume date context */
  const dispatchController = useControllerDispatch();
  const dispatchControllerDates = useControllerDispatchDates();

  const { dispatchLocalState } = useLocalUserPreferencesContext();
  const initDate = useRef(false);
  const isLargeWindow = useListenWindowSize();

  const isDateForm = start !== "" && end !== "";
  const initState = initDate.current;
  useEffect(() => {
    if (!isDateForm) {
      dispatchController({
        type: "setController",
        payload: { id: 0, client: "default", job: "" },
      });
    }
    initState && isDateForm && dispatchLocalState({ type: "toggleController" });
    initDate.current = true;
    return () => {
      isDateForm && dispatchLocalState({ type: "toggleController" });
    };
  }, [start, end]);

  const eventDispatcher = useEventDispatch();

  return (
    <tw_Controller.form
      action="post"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      {/* update button */}
      {eventSelected ? (
        <tw_Controller.button
          id={"update"}
          $display={eventSelected ? true : false}
          type="submit"
          value={"Update"}
          title={`Update event from ${eventSelected?.client || ""}`}
          onClick={() => {
            // TODO: check if is valid event
            if (!isReadyToSubmit) {
              return;
            }
            // Controller 106
            const result = fetchEvent("PUT", {
              id,
              client,
              job,
              start,
              end,
            });
            result.then((res) => {
              if (res.status === 203) {
                eventDispatcher({
                  type: "replacebyid",
                  payload: [
                    {
                      id,
                      client,
                      job,
                      start,
                      end,
                    },
                  ],
                });
              }
            });

            dispatchController({
              type: "setController",
              payload: { id: 0, client: "default", job: "" },
            });
            dispatchControllerDates({
              type: "clearDates",
            });

            setEventController(null);
          }}
        />
      ) : (
        <></>
      )}

      {/* new button */}
      <tw_Controller.button
        id={"save"}
        $display={true}
        type="submit"
        value={eventSelected ? "Copy" : "Save"}
        title="Testing to new dispatch event"
        onClick={() => {
          // TODO: check if is valid event
          if (!isReadyToSubmit) {
            return;
          }

          // Controller 158
          const result = fetchEvent("POST", {
            id: Math.floor(Math.random() * 1000),
            client,
            job,
            start,
            end,
          });
          result
            .then((res: any) => res.json())
            .then((json) => {
              scrollToDay(start);
              eventDispatcher({
                type: "appendarray",
                payload: [
                  {
                    id: json[0].id,
                    client: json[0].client,
                    job: json[0].job,
                    start: json[0].start,
                    end: json[0].end,
                  },
                ],
              });
            });

          hCancelClose();
        }}
      />
      {/* delete button */}
      <tw_Controller.button
        id={"delete"}
        $display={eventSelected ? true : false}
        type="submit"
        value={"Delete"}
        title={`Delete event from ${eventSelected?.client || ""}`}
        onClick={hDeleteClose}
      />
      {/* Log button */}
      <tw_Controller.button
        id={"debug"}
        $display={false}
        type="button"
        value={"Debug"}
        onClick={() => {
          const onlyEvents = eventState.filter((event) => event.id > 0);
          console.info(onlyEvents);
        }}
      />
      <tw_Controller.startEnd>
        {/* start field */}
        <DateField date={start} name="start" autoFocus={false} />
        {/* end field */}
        <DateField date={end} name="end" autoFocus={true} />
      </tw_Controller.startEnd>

      {/* client field */}
      <StyledSelect
        value={client}
        id={"select"}
        onChange={(e) => {
          dispatchController({
            type: "setClient",
            payload: {
              client: e.target.value,
            },
          });
        }}
      >
        <option value="default" hidden>
          Select Client
        </option>
        {CLIENTS.map((clientIterator, index) => {
          return (
            <option key={index} value={clientIterator}>
              {clientIterator}
            </option>
          );
        })}
      </StyledSelect>

      {/* job field */}
      <JobField
        value={job}
        setValue={(job: string) => {
          // const dt = DateService.GetDate();
          // const [year, month] = DateService.FormatDate(dt).split("-");
          // const date = `${year}-${month}-01`;
          scrollToDay(start);

          //      const [year, month] = start.split("-"); //Autoscroll when job field is user input to end day of month //TODO: create custom hook
          //      const dt = DateService.GetDate(parseInt(year), parseInt(month));
          //      const lastDay = DateService.GetLastDayMonth(dt);
          //      const startDay = document.getElementById(
          //        `day-${year}-${zeroPadd(parseInt(month))}-${lastDay}`
          //      );
          //      setTimeout(() => {
          //        startDay?.scrollIntoView({
          //          block: "end",
          //          inline: "end",
          //        });
          //      }, 10);
          dispatchController({
            type: "setJob",
            payload: {
              job,
            },
          });

          const getUnusedId = () => {
            //TODO: create a temporary state fot un-fetched events. In the middle, 1 is reserved id for temporal events
            // I just recover the last id from the array as it is already sorted by id and adds one
            //const lastId = eventState[eventState.length - 1].id + 1;
            const lastId = 100000;
            return lastId;
          };
          const id = eventSelected?.id || getUnusedId();
          eventDispatcher({
            type: "update",
            payload: [
              {
                id,
                client,
                job,
                start,
                end,
              },
            ],
          });
        }}
      />
      {/*
	<tw_Controller.description_wrap>
		<tw_Controller.description
			onChange={(e) => {
				setDescription(e.target.value);
			}}
			name="text"
			id="text"
			value={description}
			placeholder="Extra notes..."
		></tw_Controller.description>
	</tw_Controller.description_wrap>
	
	*/}
      {/* full screen button */}
      {
        //      <tw_Controller.button
        //        id={"full-screen"}
        //        $display={true}
        //        type="button"
        //        value={"Full Screen"}
        //        title={"Go to fullscreen mode"}
        //        onClick={() => {
        //          document.documentElement.requestFullscreen().then((res) => {
        //            setEventController(null);
        //            dispatchControllerDates({
        //              type: "clearDates",
        //              payload: { start: "", end: "" },
        //            });
        //          });
        //        }}
        //      />
      }
      {!isLargeWindow && (
        <tw_Controller.button
          $display={true}
          type="button"
          value={"Close"}
          title="Close control panel"
          onClick={() => {
            hCancelClose();
          }}
        />
      )}
    </tw_Controller.form>
  );
};
const CLIENTS = [
  "Client_1",
  "Client_2",
  "Client_3",
  "Client_4",
  "Client_5",
  "Client_6",
  "Client_7",
  "Client_8",
  "Client_9",
];

const StyledSelect = tw.select`
  border-none py-px padding-x-clamp button-shadow text-effect rounded-sm cursor-pointer outline-none
`;

function ControllerButton({
  onClick,
  name,
  display,
}: {
  onClick: any;
  name: string;
  display: boolean;
}) {
  return (
    <tw_Controller.button
      $display={display}
      type="button"
      value={name}
      onClick={onClick}
    />
  );
}

const DateField = ({
  date,
  name,
  autoFocus,
}: {
  date: string;
  name: string;
  autoFocus: boolean;
}) => {
  return (
    <>
      <tw_Controller.date
        type="text"
        name={name}
        readOnly={true}
        id={name}
        value={DateService.ExportDateToControllerValue(date)}
        autoComplete="off"
        placeholder={`${name} date`}
        autoFocus={autoFocus}
      />
    </>
  );
};

const JobField = React.memo(
  ({ value, setValue }: { value: string; setValue: (job: string) => void }) => {
    return (
      <tw_Controller.job
        onChange={(e) => {
          setValue(e.target.value);
        }}
        type="text"
        name="job"
        id="job"
        value={value}
        placeholder="Job"
      />
    );
  }
);

//export const CreateEventMemo = React.memo(CreateEvent); //!Memo doesn't work if I consume context
export const CreateEventMemo = CreateEvent;
