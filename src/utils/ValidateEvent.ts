import { event } from "@/interfaces";
import { DateService } from "./Date";

export const isValidEvent = (event: event) => {
  const isValidEvent =
    !DateService.isValidKeyDate(event.start) ||
    !DateService.isValidKeyDate(event.end) ||
    event.client === "" ||
    event.client === "default";

  return isValidEvent;
};
