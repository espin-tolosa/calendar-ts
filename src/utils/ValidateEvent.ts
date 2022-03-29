import { event } from "@/interfaces";
import { DateService } from "./Date";

/**
 * Condition that mets any event which is not considered a nullEvent
 */
//TODO: this conditions should be revisited, as it has no sense to me
export const isWellDefined = (event: event) => {
  return (
    DateService.isValidKeyDate(event.start) &&
    DateService.isValidKeyDate(event.end) &&
    DateService.DaysFrom(event.start, event.end) >= 0 &&
    event.client !== ""
  );
};
