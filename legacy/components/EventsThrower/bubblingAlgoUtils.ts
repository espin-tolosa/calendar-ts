import { sortCriteria } from "../..//hooks/useEventsState";
import { isValidPlaceholder } from "../../utils/ValidateEvent";
const isPreviousElement = (index: number) => {
  return index > 0;
};

const getEndPosition = (arr: Array<jh.event>) => {
  return arr.length;
};

const prevIndex = (current: number) => {
  return current - 1;
};

const prevIsPlaceholder = (arr: Array<jh.event>, current: number) => {
  const prevEvent = arr[prevIndex(current)];
  return isValidPlaceholder(prevEvent);
};

const isPrevEventPlaceholder = (arr: Array<jh.event>, current: number) => {
  return isPreviousElement(current) && prevIsPlaceholder(arr, current);
};

const endPosition = (current: jh.event) => {
  if (isValidPlaceholder(current)) {
    return parseInt(current.end);
  } else {
    return Infinity;
  }
};

const currentEventCanAscend = (
  merged: Array<jh.event>,
  currentPosition: number
) => {
  const prevEvent = merged[prevIndex(currentPosition)];
  return (
    isPrevEventPlaceholder(merged, currentPosition) &&
    endPosition(prevEvent) >= currentPosition
  );
};

const ascendOnePos = (arr: Array<jh.event>, current: number) => {
  [arr[prevIndex(current)], arr[current]] = [
    arr[current],
    arr[prevIndex(current)],
  ];
};

const bubblingEvent = (merged: Array<jh.event>) => {
  let currentPos = getEndPosition(merged);

  while (currentEventCanAscend(merged, --currentPos)) {
    ascendOnePos(merged, currentPos);
  }
};

export const bubblingAlgo = (dayEvents: Array<jh.event>) => {
  const placeholders = dayEvents
    .filter((e) => e.type.includes("holder"))
    .sort(sortCriteria);
  const rootEvents = dayEvents
    .filter((e) => e.type.includes("head"))
    .sort(sortCriteria); //separate the real events of that day

  //allEvents: the global state of events componsed by event objects
  //dayEvents: the events of the day filtered from the global state
  //merged: placeholder of spreaded events sorted by it target position (end) attribute
  //rootEvents: filtered day events without placeholders

  //Bubbling Algo
  //const mixture = placeholders;
  const mixture = placeholders.sort(
    (prev, next) => parseInt(prev.end) - parseInt(next.end)
  ); //start with all placeholder previously sorted
  rootEvents.map((currentEvent) => {
    mixture.push(currentEvent); //add an event at the end of the mixture
    bubblingEvent(mixture); //ascend throught the mixture as possible
  });

  return mixture;
};
