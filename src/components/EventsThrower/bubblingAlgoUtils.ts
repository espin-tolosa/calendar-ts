import { sortCriteria } from "@/hooks/useEventsState";
import { event } from "@/interfaces";
import { isValidPlaceholder } from "@/utils/ValidateEvent";
const isPreviousElement = (index: number) => {
  return index > 0;
};

const getEndPosition = (arr: Array<any>) => {
  return arr.length;
};

const prevIndex = (current: number) => {
  return current - 1;
};

const prevIsPlaceholder = (arr: Array<event>, current: number) => {
  const prevEvent = arr[prevIndex(current)];
  return isValidPlaceholder(prevEvent);
};

const isPrevEventPlaceholder = (arr: Array<event>, current: number) => {
  return isPreviousElement(current) && prevIsPlaceholder(arr, current);
};

const endPosition = (current: event) => {
  if (isValidPlaceholder(current)) {
    return parseInt(current.end);
  } else {
    return Infinity;
  }
};

const currentEventCanAscend = (
  merged: Array<event>,
  currentPosition: number
) => {
  const prevEvent = merged[prevIndex(currentPosition)];
  return (
    isPrevEventPlaceholder(merged, currentPosition) &&
    endPosition(prevEvent) >= currentPosition
  );
};

const ascendOnePos = (arr: Array<event>, current: number) => {
  [arr[prevIndex(current)], arr[current]] = [
    arr[current],
    arr[prevIndex(current)],
  ];
};

const bubblingEvent = (merged: Array<event>) => {
  let currentPos = getEndPosition(merged);

  while (currentEventCanAscend(merged, --currentPos)) {
    ascendOnePos(merged, currentPos);
  }
};

export const bubblingAlgo = (dayEvents: Array<event>) => {
  const placeholders = dayEvents.filter((e) => e.id < 0).sort(sortCriteria);
  const rootEvents = dayEvents.filter((e) => e.id > 0).sort(sortCriteria); //separate the real events of that day

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
