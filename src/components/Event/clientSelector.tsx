import * as StyledEvent from "./tw";
import { event } from "../../interfaces";
import React, { useCallback } from "react";
import { useDoubleClick } from "../../hooks/useDoubleClick";
import { fetchEvent } from "../../utils/fetchEvent";
import { usePushedDaysDispatcher } from "../../hooks/usePushDays";
import { useEventDispatch } from "../../hooks/useEventsState";
import { useControllerDispatch } from "../../hooks/useController";
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
  event: event;
};

//export const EventCard: React.FC<EventCard> = (propTypes): JSX.Element => {
export const EventClientSelector: React.FC<ClientSelector> = (
  propTypes
): JSX.Element => {
  const doubleClick = useCallback(() => {
    console.info("Click on client selector");
  }, []);
  const eventDispatcher = useEventDispatch();
  const pushDaysDispatcher = usePushedDaysDispatcher();
  const hDoubleClick = useDoubleClick(doubleClick);
  const controllerStateDispatch = useControllerDispatch();
  const updateClient = (clientIterator: string) => {
    fetchEvent("PUT", { ...propTypes.event, client: clientIterator });
    eventDispatcher({
      type: "update",
      payload: [{ ...propTypes.event, client: clientIterator }],
      callback: pushDaysDispatcher,
    });
    //Imperative render
    controllerStateDispatch({
      type: "setId",
      payload: { id: Math.abs(propTypes.event.id) },
    });
  };
  return (
    <StyledEvent.TWStyledSelect
      value={propTypes.event.client}
      style={propTypes.style}
      id={"select"}
      onChange={(e) => {
        if (e.currentTarget.value === "Unavailable") {
          window.alert("delete");
        }
        updateClient(e.currentTarget.value);
        e.currentTarget.blur();
      }}
      {...hDoubleClick}
    >
      <option
        value="default"
        hidden
        disabled={propTypes.event.client !== "Select Client"}
      >
        Select Client
      </option>
      {CLIENTS.map((clientIterator, index) => {
        return (
          <option key={index} value={clientIterator}>
            {clientIterator}
          </option>
        );
      })}
    </StyledEvent.TWStyledSelect>
  );
};

/*

      <StyledSelect
        value={client}
        id={"select"}
        onChange={(e) => {
          dispatchController({
            type: "setClient",
            payload: {
              client: e.target.value,
            },
          });
        }}
      >
        <option value="default" hidden>
          Select Client
        </option>
        {CLIENTS.map((clientIterator, index) => {
          return (
            <option key={index} value={clientIterator}>
              {clientIterator}
            </option>
          );
        })}
      </StyledSelect>

*/
