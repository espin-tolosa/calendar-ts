import * as StyledEvent from "./tw";
import { event } from "../../interfaces";
import React, { useCallback, useEffect, useState } from "react";
import { useDoubleClick } from "../../hooks/useDoubleClick";
import { fetchEvent } from "../../utils/fetchEvent";
import { usePushedDaysDispatcher } from "../../hooks/usePushDays";
import { useEventDispatch } from "../../hooks/useEventsState";
import { useControllerDispatch } from "../../hooks/useController";
import { useClientsStyles } from "@/context/queryClientStyles";

function useQueryClientsStyles() {
  const [clients, setClients] = useState<Array<string>>([]);
  //fetch("http://192.168.1.141/backend/routes/client_styles.api.php")

  useEffect(() => {
    setClients([]);
  }, []);

  return clients;
}

export type ClientSelector = {
  style: object;
  event: event;
};

//export const EventCard: React.FC<EventCard> = (propTypes): JSX.Element => {
export const EventClientSelector: React.FC<ClientSelector> = (
  propTypes
): JSX.Element => {
  const clients = useQueryClientsStyles();
  const cStyles = useClientsStyles();
  console.log(cStyles?.success);
  const doubleClick = useCallback(() => {
    //console.info("Click on client selector");
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
      //style={propTypes.style}
      $name={propTypes.event.client}
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
      {cStyles?.success &&
        cStyles.clients.map((clientIterator, index) => {
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
