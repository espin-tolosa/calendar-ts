import {
  useEventSelected,
  useSetEventSelected,
} from "@/globalStorage/eventSelected";
import { useControllerDispatch } from "@/hooks/useController";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import { useEventDispatch } from "@/hooks/useEventsState";
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
  return () => {
    const getUnusedId = () => {
      const lastId = 100000;
      return lastId;
    };
    setEventController(null);
    eventDispatcher({
      type: "deletebyid",
      payload: [{ ...eventSelected!, id: getUnusedId() }], //TODO: delete temporary event state with un-fetched events, like press Esc before Save a new event
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

export function useGethDeleteEvent(): () => void {
  const eventSelected = useEventSelected();
  const SetEventSelected = useSetEventSelected();
  const dispatchController = useControllerDispatch();
  const eventDispatcher = useEventDispatch();
  const dispatchControllerDates = useControllerDispatchDates();
  return async () => {
    const deleteResourceInAPI = async () => {
      const result = await fetchEvent("DELETE", eventSelected!);
      if (result.status === 204) {
        console.log("Clear controller");
        dispatchController({
          type: "setController",
          payload: { id: 0, client: "", job: "" },
        });
        dispatchControllerDates({
          type: "clearDates",
        });
        SetEventSelected(null);
      } else {
        console.log("reset event", eventSelected);
        eventDispatcher({
          type: "appendarray",
          payload: [eventSelected!],
        });
      }

      return result.status;
    };

    const MAX_ATTEMPTS = 10;
    const success = (code: number) => code === 204;

    eventDispatcher({
      type: "deletebyid",
      payload: [eventSelected!],
    });
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      try {
        const status = await deleteResourceInAPI();
        if (success(status)) {
          break;
        }
      } catch (e) {}
      if (i === MAX_ATTEMPTS - 1) {
        alert("Something went wrong, unable to delete event");
        eventDispatcher({
          type: "appendarray",
          payload: [eventSelected!],
        });
        dispatchController({
          type: "setController",
          payload: { id: 0, client: "", job: "" },
        });
        dispatchControllerDates({
          type: "clearDates",
        });
        SetEventSelected(null);
      }
    }
  };
}
