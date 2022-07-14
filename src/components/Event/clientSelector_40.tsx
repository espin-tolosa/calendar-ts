import * as StyledEvent from "./tw";
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
  event: jh.event;
  style: object;
};

export const EventClientSelector = ({ event, style }: ClientSelector) => {
  return (
    <StyledEvent.TWStyledSelect
      value={event.client}
      style={style}
      id={"select"}
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
    </StyledEvent.TWStyledSelect>
  );
};
