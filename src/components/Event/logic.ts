import {
  useControllerDispatch,
  useControllerState,
} from "@/hooks/useController";
import { event } from "@/interfaces";
import { ClientColorStyles } from "@/utils/giveMeColor";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchEvent } from "@/utils/fetchEvent";
import { useEventDispatch } from "@/hooks/useEventsState";
import { resourceLimits } from "worker_threads";

export const useTransitionStyle = (
  isChildren: boolean,
  hover: boolean,
  event: event
) => {
  const clientID = parseInt(event.client.split("_")[1]);
  const CLIENTS_LENGTH = 9;
  const EXTRA_COLORS = 1;

  //Initialize with color error
  let mapClientToColor = (360 * (10 - 1)) / (CLIENTS_LENGTH + EXTRA_COLORS);
  //then if client parses properly -> map to client color
  if (!isNaN(clientID) && clientID <= 5) {
    mapClientToColor = (360 * (clientID - 1)) / 5;
  } else if (!isNaN(clientID) && clientID > 5) {
    mapClientToColor = (360 * (clientID - 6)) / 5 + 180 / 5;
  }
  const [r, g, b] = ClientColorStyles(mapClientToColor, 0.8, 0.8);
  const [r_h, g_h, b_h] = ClientColorStyles(mapClientToColor, 0.4, 0.7);
  const [r_b, g_b, b_b] = ClientColorStyles(mapClientToColor, 0.8, 0.2);
  const [r_c, g_c, b_c] = ClientColorStyles(mapClientToColor, 0.7, 0.3);
  //Check if event is temporary and in that case return a steady style
  //this will be skiped when then event become sync with database
  if (event.id === Number.MAX_SAFE_INTEGER) {
    const temporaryBody = composeStyle(
      "lightgray",
      "2px solid transparent",
      "black",
      "2px solid transparent"
    );
    const header = composeStyle(
      `rgb(${r_c}, ${g_c}, ${b_c})`,
      "2px solid transparent",
      "black",
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
            "black",
            "2px solid transparent"
          )
        : !hover
        ? composeStyle(
            `rgb(${r}, ${g}, ${b})`,
            "2px solid transparent",
            "transparent",
            "2px solid transparent"
          )
        : composeStyle(
            `rgb(${r_h},${g_h},${b_h})`,
            `2px solid rgb(${r_b},${g_b},${b_b})`,
            "transparent",
            "2px solid transparent"
          );
    } else {
      result = justThrown
        ? composeStyle(
            "lightgray",
            "2px solid transparent",
            "black",
            "2px solid transparent"
          )
        : !hover
        ? composeStyle(
            `rgb(${r}, ${g}, ${b})`,
            "2px solid transparent",
            "black",
            "2px solid transparent"
          )
        : composeStyle(
            `rgb(${r_h}, ${g_h}, ${b_h})`,
            `2px solid rgb(${r_b}, ${g_b},${b_b})`,
            "white",
            `2px solid rgb(${r_b}, ${g_b},${b_b})`
          );
    }

    return {
      dinamic: result,
      static: { background: `rgb(${r_b}, ${g_c}, ${b_c})` },
    };
  }, [justThrown, hover]);
};

const composeStyle = (
  background: string,
  borderTop: string,
  color: string,
  borderLeft: string
) => {
  return {
    background,
    borderTop,
    borderBottom: borderTop,
    borderRight: borderTop,
    color,
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

export const useStorage = (event: event) => {
  //Inline Edit
  const [isSelected, setIsSelected] = useState(false);
  const isFocus = useRef<HTMLInputElement>(null);
  const [jobInput, setJobInput] = useState(event.job);
  const eventDispatcher = useEventDispatch();

  const readyToSubmit = useRef<boolean>(false);

  const updateEvent = (newEvent: event) => {
    // TODO: check if is valid event
    // Controller 106
    //TODO: turn to async function in order to catch net Errors
    const result = fetchEvent("PUT", newEvent);

    result.then((res) => {
      if (res.status === 203) {
        eventDispatcher({
          type: "update",
          payload: [newEvent],
        });
      } else {
        const error = res.status === 401 ? "Unauthorized" : "Server error";
        alert("Something went wrong: " + error);
        window.location.reload();
      }
    });
  };

  const hOnBlur = () => {
    if (readyToSubmit.current) {
      updateEvent({ ...event, job: jobInput });
      readyToSubmit.current = false;
    }

    setIsSelected(false);
  };

  const hOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsSelected(true);
  };
  const hOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enter = e.target.value === "Enter";
    if (enter) {
      isFocus.current!.blur();
      return;
    }
    setJobInput(e.target.value);
    updateEvent({ ...event, job: e.target.value });
  };

  const hOnKeyDown = (e: React.KeyboardEvent) => {
    const enter = e.key === "Enter";
    if (enter) {
      isFocus.current!.blur();
    }

    const cancel = e.key === "Escape";
    if (cancel) {
      readyToSubmit.current = false;
      isFocus.current!.blur();
    }
  };

  const eventUpdater = {
    onBlur: hOnBlur,
    onChange: hOnChange,
    onClick: hOnClick,
    onKeyDown: hOnKeyDown,
  };

  const toComponent = {
    isSelected,
    jobInput,
    isFocus,
    ...eventUpdater,
  };

  return toComponent;
};
