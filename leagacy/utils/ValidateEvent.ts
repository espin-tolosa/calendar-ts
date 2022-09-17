import { DateService } from "./Date";

/**
 * Condition that mets any event which is considered to be representable in the UI
 */
export const isWellDefined = (event: jh.event) => {
  return (
    DateService.isValidKeyDate(event.start) &&
    DateService.isValidKeyDate(event.end) &&
    DateService.DaysFrom(event.start, event.end) >= 0 &&
    event.client !== ""
  );
};

const isChildren = (event: jh.event) => {
  return event.type === "tailhead";
};
export const isPlaceholder = (event: jh.event) => {
  return event.type.includes("holder");
};
export const isValidChildren = (event: jh.event) => {
  return isChildren(event) && isWellDefined(event);
};

export const isValidPlaceholder = (event: jh.event) => {
  return isPlaceholder(event) /* && isWellDefined(event)*/;
};

// Valid event is decided by substraction as it is anything that is not a placeholder or a children
// I use this method because an event could be represented by an higher dimension of possibilities rather than placeholders and childrens
export const isValidEvent = (event: jh.event) => {
  const isEvent = !isChildren && !isPlaceholder;
  return isEvent && isWellDefined(event);
};
