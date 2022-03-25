import { useEffect } from "react";
import { useControllerDispatch } from "@/hooks/useController";

import { useGethCancel, useGethDeleteEvent } from "@/api/handlers";
import { useCtxKeyBufferDispatcher } from "@/globalStorage/keyBuffer";
import { useEventSelected } from "@/globalStorage/eventSelected";

export const useKeyboardShortcuts = () => {
  const dispatchKeyBuffer = useCtxKeyBufferDispatcher();

  const eventSelected = useEventSelected();
  const dispatchController = useControllerDispatch();

  const hCancel = useGethCancel();
  const hDelete = useGethDeleteEvent();
  useEffect(() => {
    const hOnKeyDown = (e: KeyboardEvent) => {
      if (eventSelected && e.key === "Delete") {
        hDelete();
      } else if (e.key === "Escape") {
        hCancel();
      } else if (e.key === "Control") {
        dispatchKeyBuffer(e.key);
      } else if (!isNaN(parseInt(e.key))) {
        const jobField = document.getElementById("job");
        const selectField = document.querySelector("select");

        if (jobField !== document.activeElement) {
          dispatchController({
            type: "setClient",
            payload: {
              client: `Client_${e.key}`,
            },
          });
          selectField?.focus();
        }
      } else if (e.key === "Tab") {
        const selectField = document.getElementById("select");
        const jobField = document.getElementById("job");
        //const save = document.getElementById("save");
        //TODO: state machine to traverse each editable option of the controller
        if ("job" === document.activeElement?.id) {
          jobField?.focus();
        } else {
          selectField?.focus();
        }
      }
    };
    const hOnKeyUp = () => {
      dispatchKeyBuffer("");
    };

    document.querySelector("html")?.addEventListener("keydown", hOnKeyDown);
    document.querySelector("html")?.addEventListener("keyup", hOnKeyUp);
    return () => {
      document
        .querySelector("html")
        ?.removeEventListener("keydown", hOnKeyDown);
      document.querySelector("html")?.removeEventListener("keyup", hOnKeyUp);
    };
  }, [eventSelected]);
};
