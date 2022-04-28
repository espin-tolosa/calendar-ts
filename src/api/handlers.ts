import { EventClass } from "@/classes/event";
import { useEventSelected, useSetEventSelected } from "@/context/eventSelected";
import { useControllerDispatch } from "@/hooks/useController";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import { useEventDispatch } from "@/hooks/useEventsState";
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";
import { event } from "@/interfaces";
import { fetchEvent } from "@/utils/fetchEvent";

// Custom-hook: useGethCancel
//
// Gives a Cancel function that can be used to any component that has access to context
// in the same as Cancel button within Controller
//
// - SetEventSelected: null
// - ControllerDispatch: null
// - ControllerDispatchDates: null
// - EventDispatch: clear temporary event
//
// A temporary event is tracked by getUnusedId
//

export function useGethCancel() {
  const eventSelected = useEventSelected();
  const setEventController = useSetEventSelected();
  const dispatchController = useControllerDispatch();
  const eventDispatcher = useEventDispatch();
  const dispatchControllerDates = useControllerDispatchDates();
  const pushDaysDispatcher = usePushedDaysDispatcher();
  return () => {
    setEventController(null);
    eventDispatcher({
      type: "delete",
      payload: [{ ...eventSelected!, id: EventClass.getUnusedId() }], //TODO: delete temporary event state with un-fetched events, like press Esc before Save a new event
      callback: pushDaysDispatcher,
    });

    dispatchController({
      type: "setController",
      payload: { id: 0, client: "", job: "" },
    });
    dispatchControllerDates({
      type: "clearDates",
    });
  };
}

// Custom-hook: useGethDeleteEvent
//
// Gives a Delete function that can be used to any component that has access to context:
// in the same as Delete button within Controller
//
// - SetEventSelected: null
// - ControllerDispatch: null
// - ControllerDispatchDates: null
// - EventDispatch: clear temporary event
//
// A temporary event is tracked by getUnusedId
//

export function useGethDeleteEvent(eventSelected: event): () => void {
  const eventDispatcher = useEventDispatch();
  const pushDaysDispatcher = usePushedDaysDispatcher();

  // First time I'm able to catch error Failed to Fetch
  // it needs async function to get caught
  return async () => {
    if (!eventSelected) {
      return;
    }
    const deleteResourceInAPI = async () => {
      const result = await fetchEvent("DELETE", eventSelected);

      return result.status;
    };

    const MAX_ATTEMPTS = 10;
    const success = (code: number) => code === 204;

    eventDispatcher({
      type: "delete",
      payload: [eventSelected!],
      callback: pushDaysDispatcher,
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
}
