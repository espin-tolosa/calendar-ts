import {
  useEventSelected,
  useSetEventSelected,
} from "@/components/Controller/main";
import { useControllerDispatch } from "@/hooks/useController";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import { useEventDispatch } from "@/hooks/useEventsState";
import { fetchEvent } from "@/utils/fetchEvent";

export const useGethCancel = () => {
  const eventSelected = useEventSelected();
  const setEventController = useSetEventSelected();
  const dispatchController = useControllerDispatch();
  const eventDispatcher = useEventDispatch();
  const dispatchControllerDates = useControllerDispatchDates();
  return () => {
    const getUnusedId = () => {
      //TODO: create a temporary state fot un-fetched events. In the middle, 1 is reserved id for temporal events
      // I just recover the last id from the array as it is already sorted by id and adds one
      //const lastId = eventState[eventState.length - 1].id + 1;
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
};

export const useGethDeleteEvent = () => {
  const eventSelected = useEventSelected();
  const setEventController = useSetEventSelected();
  const dispatchController = useControllerDispatch();
  const eventDispatcher = useEventDispatch();
  const dispatchControllerDates = useControllerDispatchDates();
  console.log("delete supr", eventSelected);
  return () => {
    // TODO: check if is valid event
    //if (!isReadyToSubmit) {
    //  return;
    //}
    const result = fetchEvent("DELETE", eventSelected!);
    result.then((res) => {
      if (res.status === 204) {
        eventDispatcher({
          type: "deletebyid",
          payload: [eventSelected!],
        });
        dispatchController({
          type: "setController",
          payload: { id: 0, client: "", job: "" },
        });
        dispatchControllerDates({
          type: "clearDates",
        });
      }
    });

    setEventController(null);
  };
};
