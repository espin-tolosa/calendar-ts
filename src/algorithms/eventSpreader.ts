import { event } from "@/interfaces";
import { DateService } from "@/utils/Date";

export const eventSpreader = (event: event) => {
  const spreadEvent: Array<event> = [];

  let nextDate = DateService.GetNextDayOfDate(event.start);
  let keyNextDate = DateService.FormatDate(nextDate);
  const eventLength = DateService.DaysFromStartToEnd(event.start, event.end);

  for (let day = 0; day < eventLength; day++) {
    const dayWeek = DateService.GetMonthDayKey(nextDate);
    if (isNewRowDay(dayWeek)) {
      spreadEvent.push(toMonday(event, keyNextDate));
    } else {
      spreadEvent.push(toPlaceholder(event, keyNextDate));
    }
    nextDate = DateService.GetNextDayOfDate(keyNextDate);
    keyNextDate = DateService.FormatDate(nextDate);
  }

  return spreadEvent;
};

const toPlaceholder = (event: event, targetDay: string) => {
  return { ...event, id: -event.id, start: targetDay, end: targetDay };
};
const toMonday = (event: event, targetDay: string) => {
  return { ...event, start: targetDay };
};

const isNewRowDay = (dayWeek: string) => {
  return dayWeek.toLocaleLowerCase() === "monday";
};
