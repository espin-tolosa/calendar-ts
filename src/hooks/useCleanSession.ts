import { useSetEventSelected } from "@/globalStorage/eventSelected";
import { useEffect, useState } from "react";
import { useControllerDispatch } from "./useController";
import { useControllerDispatchDates } from "./useControllerDate";
import { useUserSession } from "./useUserSession";

export const useCleanSession = () => {
  const [isToClean, setIsToClean] = useState(false);

  const setSession = useUserSession();

  const setEventController = useSetEventSelected();
  const dispatchController = useControllerDispatch();
  const dispatchControllerDates = useControllerDispatchDates();
  useEffect(() => {
    if (!isToClean) {
      return;
    }

    setSession.clearLoginSession();
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
