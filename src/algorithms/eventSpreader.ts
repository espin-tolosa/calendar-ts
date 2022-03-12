import { event } from "@/interfaces";
import { DateService } from "@/utils/Date";
/**
 * Event Spreader extends the local state to represent those events
 * that spans along multiple days.
 * @param event: directly fetched from database
 * @returns event[]: expanded event to incorporate to the local state events context
 */
export const eventSpreader = (event: event) => {
  const spreadEvent: Array<event> = [];

  let nextDt = DateService.GetNextDayOfDate(event.start);
  let nextDay = DateService.FormatDate(nextDt);
  const eventLength = DateService.DaysFrom(event.start, event.end);

  for (let day = 0; day < eventLength; day++) {
    const dayWeek = DateService.GetMonthDayKey(nextDt);
    // 			1. Is monday: ok
    // 			2. Is day 1: ok
    //TODO: 3. Is day after day off: no
    //TODO: Span event proper size, actually spans-8 (maximun) allways
    if (
      !isWeekend(dayWeek) &&
      (isMonday(dayWeek) || isFirstMonthDay(nextDay))
    ) {
      spreadEvent.push(toMonday(event, nextDay));
    } else {
      spreadEvent.push(toPlaceholder(event, nextDay));
    }
    nextDt = DateService.GetNextDayOfDate(nextDay);
    nextDay = DateService.FormatDate(nextDt);
  }

  return spreadEvent;
};

const toPlaceholder = (event: event, targetDay: string) => {
  return { ...event, id: -event.id, start: targetDay, end: targetDay };
};
const toMonday = (event: event, targetDay: string) => {
  return { ...event, start: targetDay, job: "#isChildren" };
};

const isMonday = (dayWeek: string) => {
  return dayWeek.toLocaleLowerCase() === "monday";
};
const isWeekend = (dayWeek: string) => {
  const day = dayWeek.toLocaleLowerCase();
  return day === "saturday" || day === "sunday";
};

const isFirstMonthDay = (dayWeek: string) => {
  const FirstDayNum = "01";
  const ExtractedDay = dayWeek.split("-")[2];
  return ExtractedDay === FirstDayNum;
};
