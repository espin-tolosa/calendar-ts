import { event } from "@/interfaces";
import { ClientColorStyles } from "@/utils/giveMeColor";
import { useEffect, useMemo, useState } from "react";

export const useTransitionStyle = (
  isChildren: boolean,
  hover: boolean,
  event: event
) => {
  const [justThrown, setJustThrown] = useState(true);
  useEffect(() => {
    const relaxTime = 200; /*ms*/
    const timeoutHandler = setTimeout(() => setJustThrown(false), relaxTime);
    return () => {
      clearTimeout(timeoutHandler);
    };
  }, []);

  return useMemo(() => {
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
    const [r_b, g_b, b_b] = ClientColorStyles(mapClientToColor, 0.2, 0.4);
    if (isChildren) {
      return justThrown
        ? composeStyle("lightgray", "1px solid transparent", "black")
        : !hover
        ? composeStyle(
            `rgb(${r}, ${g}, ${b})`,
            "1px solid transparent",
            "transparent"
          )
        : composeStyle(
            `rgb(${r_h},${g_h},${b_h})`,
            `1px solid rgb(${r_b},${g_b},${b_b})`,
            "transparent"
          );
    }
    return justThrown
      ? composeStyle("lightgray", "1px solid transparent", "black")
      : !hover
      ? composeStyle(`rgb(${r}, ${g}, ${b})`, "1px solid transparent", "black")
      : composeStyle(
          `rgb(${r_h}, ${g_h}, ${b_h})`,
          `1px solid rgb(${r_b}, ${g_b},${b_b})`,
          "white"
        );
  }, [justThrown, hover]);
};

const composeStyle = (background: string, border: string, color: string) => {
  return {
    background,
    border,
    color,
  };
};
