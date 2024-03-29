import { nullEvent } from "../interfaces";
import { EventClass } from "../classes/event";
import {
  useEventSelected,
  useSetEventSelected,
} from "../context/eventSelected";
import { useControllerDispatch } from "../hooks/useController";
import { useControllerDispatchDates } from "../hooks/useControllerDate";
import { useEventDispatch } from "../hooks/useEventsState";
import { fetchEvent } from "../utils/fetchEvent";
import { FetchEvent } from "../classes/fetchEvent";

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
  const eventSelected = useEventSelected() ?? nullEvent(); //!TODO Important change to debug
  const setEventController = useSetEventSelected();
  const dispatchController = useControllerDispatch();
  const eventDispatcher = useEventDispatch();
  const dispatchControllerDates = useControllerDispatchDates();
  return () => {
    setEventController(null);
    eventDispatcher({
      type: "delete",
      payload: [{ ...eventSelected, id: EventClass.getUnusedId() }], //TODO: delete temporary event state with un-fetched events, like press Esc before Save a new event
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

export function useGethDeleteEvent(eventSelected: jh.event): () => void {
  const eventDispatcher = useEventDispatch();

  // First time I'm able to catch error Failed to Fetch
  // it needs async function to get caught
  return async () => {
    //!TODO: Important to debug: why I'm checking a condition that is not reflected in its type? eventSelect can't be nothing than :event
    if (!eventSelected) {
      return;
    }
    const deleteResourceInAPI = async () => {

        const Event = new FetchEvent();
        await Event.destroy(eventSelected);
        return 204; //jajaja
        //ireturn result.status;
    };

    const MAX_ATTEMPTS = 10;
    const success = (code: number) => code === 204;

    eventDispatcher({type: "delete", payload: [eventSelected]});

    //This try to fetch 10 times before refresh the web page
    /*eslint no-empty: "error"*/
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      try {
        const status = await deleteResourceInAPI();
        if (success(status)) {
          break;
        }
      } catch {
        /* empty */
      }
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
