import { useEffect, useState } from "react";
import { clearLogin } from "@/window/fetch";
import { useSetEventSelected } from "@/context/eventSelected";
import { useControllerDispatch } from "@/hooks/useController";
import { useControllerDispatchDates } from "@/hooks/useControllerDate";
import { useEventDispatch } from "./useEventsState";
import { nullEvent } from "@/customTypes";

// This is the reference hook to clean te entire memory,
// any component should consume this to clear temporary states
// Eventually this will grow up, to host clear options,
// so the useState hook will be interchanged by useReducer
export const useCleanSession = () => {
  const [isToClean, setIsToClean] = useState(false);

  const setEventController = useSetEventSelected();
  const dispatchController = useControllerDispatch();
  const dispatchControllerDates = useControllerDispatchDates();
  const dispatchEvent = useEventDispatch();
  useEffect(() => {
    if (!isToClean) {
      return;
    }
    clearLogin();

    setEventController(null);

    dispatchController({
      type: "setController",
      payload: { id: 0, client: "", job: "" },
    });

    dispatchControllerDates({
      type: "clearDates",
    });

    dispatchEvent({
      type: "unmount",
      payload: [nullEvent()],
      callback: () => {},
    });

    setIsToClean(false);
  }, [isToClean]);

  return setIsToClean;
};
