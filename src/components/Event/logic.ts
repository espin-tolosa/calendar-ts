import {
  useControllerDispatch,
  useControllerState,
} from "../../hooks/useController";
import { event } from "../../interfaces";
import { HEXtoHSL, HSLController } from "../../utils/giveMeColor";
import { useEffect, useMemo, useState } from "react";

export const useStyles = (
  isChildren: boolean,
  hover: boolean,
  event: event,
  clientColor: string
) => {
  const mapClientToColor = HEXtoHSL(clientColor);
  if (mapClientToColor === undefined) {
    return;
  }
  const cTransition = HSLController(mapClientToColor.h, 0.8, 0.8);
  const cHover = HSLController(mapClientToColor.h, 0.6, 0.9); //controls the text
  const cBase = HSLController(mapClientToColor.h, 0.8, 0.6); //controls the border on hover
  const cHeader = HSLController(mapClientToColor.h, 0.7, 0.6); //controls the top bar
  //Check if event is temporary and in that case return a steady style
  //this will be skiped when then event become sync with database
  if (event.id === Number.MAX_SAFE_INTEGER) {
    const temporaryBody = composeStyle(
      "lightgray",
      "2px solid transparent",
      "2px solid transparent"
    );
    const header = composeStyle(
      cHeader,
      "2px solid transparent",
      "2px solid transparent"
    );
    return {
      dinamic: temporaryBody,
      static: header,
    };
  }

  const [justThrown, setJustThrown] = useState(true);
  useEffect(() => {
    const relaxTime = 200; /*ms*/
    const timeoutHandler = setTimeout(() => setJustThrown(false), relaxTime);
    return () => {
      clearTimeout(timeoutHandler);
    };
  }, []);

  return useMemo(() => {
    let result = {};
    if (isChildren) {
      result = justThrown
        ? composeStyle(
            "lightgray",
            "2px solid transparent",
            "2px solid transparent"
          )
        : !hover
        ? composeStyle(
            cTransition,
            "2px solid transparent",
            "2px solid transparent"
          )
        : composeStyle(cHover, `2px solid ${cBase}`, "2px solid transparent");
    } else {
      result = justThrown
        ? composeStyle(
            "lightgray",
            "2px solid transparent",
            "2px solid transparent"
          )
        : !hover
        ? composeStyle(cHover, "2px solid transparent", "2px solid transparent")
        : composeStyle(cHover, `2px solid ${cBase}`, `2px solid ${cBase}`);
    }

    return {
      dinamic: result,
      static: { background: cHeader },
    };
  }, [justThrown, hover]);
};

const composeStyle = (
  background: string,
  borderTop: string,
  borderLeft: string
) => {
  return {
    background,
    borderTop,
    borderBottom: borderTop,
    borderRight: borderTop,
    borderLeft,
  };
};

export const useHoverEvent = (event: event) => {
  // Hover consumes the controller state to decide if the on going render will be styled as a hover envet
  const controllerState = useControllerState();
  const controllerStateDispatch = useControllerDispatch();

  return {
    hover: Math.abs(controllerState.id) === Math.abs(event.id),

    onMouseEnter: () => {
      controllerStateDispatch({
        type: "setId",
        payload: { id: Math.abs(event.id) },
      });
    },

    onMouseLeave: () => {
      controllerStateDispatch({
        type: "setId",
        payload: { id: Math.abs(0) },
      });
    },
  };
};
