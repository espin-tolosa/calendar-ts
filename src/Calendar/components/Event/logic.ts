import {useControllerDispatch, useControllerState} from "../../hooks/useController";
import { HEXtoHSL, HSLController } from "../../utils/giveMeColor";
import { useEffect, useMemo, useState } from "react";

//! This is leagacy code to me. It's a gift from me to me. I mostly don't know how it works but it works

interface Styles
{
    static: {background: string; borderTop: string; borderBottom: string};
    dinamic: {background: string; borderTop: string; borderBottom: string};
}

export function useStyles(hover: boolean, event: jh.event, clientColor: string) : Styles
{
  const isChildren = event.type === "tailhead";
  const mapClientToColor = HEXtoHSL(clientColor);
  if (mapClientToColor === undefined) {
    return (
        {static: {background: "lightgray", borderBottom: "2px solid transparent", borderTop: "2px solid transparent"}, dinamic: {background: "darkgray", borderBottom: "2px solid transparent", borderTop: "2px solid transparent"}}
    )
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
      dinamic: result as { background: string, borderTop: string, borderBottom: string },
      //TODO fix this type casting from composeStyle
      static: { background: cHeader, borderTop: "2px solid transparent", borderBottom: "2px solid transparent" },
    };
  }, [justThrown, hover, clientColor]);
}

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

export const useHoverEvent = (event: jh.event) => {
  // Hover consumes the controller state to decide if the on going render will be styled as a hover envet
  const controllerState = useControllerState();
  const controllerStateDispatch = useControllerDispatch();

  return {
    hover: controllerState.id === event.id,

    onMouseEnter: () => {
      controllerStateDispatch({
        type: "setId",
        payload: { id: event.id },
      });
    },

    onMouseLeave: () => {
      controllerStateDispatch({
        type: "setId",
        payload: { id: 0 },
      });
    },
  };
};
