import * as StyledEvent from "./tw";
import React, { useCallback } from "react";
import { useDoubleClick } from "@/hooks/useDoubleClick";
const CLIENTS = [
  "Client_1",
  "Client_2",
  "Client_3",
  "Client_4",
  "Client_5",
  "Client_6",
  "Client_7",
  "Client_8",
  "Client_9",
  "Unavailable",
];

export type ClientSelector = {
  style: object;
};

//export const EventCard: React.FC<EventCard> = (propTypes): JSX.Element => {
export const EventClientSelector: React.FC<ClientSelector> = (
  propTypes
): JSX.Element => {
  const doubleClick = useCallback(() => {
    console.log("Click on client selector");
  }, []);
  const hDoubleClick = useDoubleClick(doubleClick);
  return (
    <StyledEvent.TWStyledSelect
      style={propTypes.style}
      id={"select"}
      {...hDoubleClick}
    >
      Select Client
    </StyledEvent.TWStyledSelect>
  );
};
