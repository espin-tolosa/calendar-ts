import { useSetEventSelected } from "@/globalStorage/eventSelected";
import { useEffect, useState } from "react";
import { useControllerDispatch } from "./useController";
import { useControllerDispatchDates } from "./useControllerDate";
import { useUserSession } from "./useUserSession";

// This is the reference hook to clean te entire memory,
// any component should consume this to clear temporary states
// Eventually this will grow up, to host clear options,
// so the useState hook will be interchanged by useReducer
export const useCleanSession = () => {
  const [isToClean, setIsToClean] = useState(false);

  const { clearLoginSession } = useUserSession();

  const setEventController = useSetEventSelected();
  const dispatchController = useControllerDispatch();
  const dispatchControllerDates = useControllerDispatchDates();
  useEffect(() => {
    if (!isToClean) {
      return;
    }

    clearLoginSession();
    setEventController(null);

    dispatchController({
      type: "setController",
      payload: { id: 0, client: "", job: "" },
    });
    dispatchControllerDates({
      type: "clearDates",
    });

    setIsToClean(false);
  }, [isToClean]);

  return setIsToClean;
};
