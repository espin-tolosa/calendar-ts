import { DateService } from "../utils/Date";
/**
 * Event Spreader extends the local state to represent those events
 * that spans along multiple days.
 * @param event: directly fetched from database
 * @returns event[]: expanded event to incorporate to the local state events context
 */
export const eventSpreader = (event: jh.event) => {
  const spreadEvent: Array<jh.event> = [];

  let nextDt = DateService.GetNextDayOfDate(event.start);
  let nextDay = DateService.FormatDate(nextDt);
  let isChildren = false;
  let isChildrenPlaceholder = false;
  const eventLength = DateService.DaysFrom(event.start, event.end);

  for (let day = 0; day < eventLength; day++) {
    const dayWeek = DateService.GetMonthDayKey(nextDt);
    // 			1. Is monday: ok
    // 			2. Is day 1: ok
    //TODO: 3. Is day after day off: no
    //TODO: Span event proper size, actually spans-8 (maximun) allways
    isChildren =
      !isWeekend(dayWeek) && (isMonday(dayWeek) || isFirstMonthDay(nextDay));
    if (isChildren) {
      spreadEvent.push(toMonday(event, nextDay));
      isChildrenPlaceholder = true;
    } else if (isChildrenPlaceholder) {
      spreadEvent.push(toChildren(event, nextDay, "tailholder"));
    } else {
      spreadEvent.push(toChildren(event, nextDay, "rootholder"));
    }
    nextDt = DateService.GetNextDayOfDate(nextDay);
    nextDay = DateService.FormatDate(nextDt);
  }

  return spreadEvent;
};

const toMonday = (event: jh.event, targetDay: string): jh.event => {
  return { ...event, start: targetDay, type: "tailhead" };
};

const toChildren = (
  event: jh.event,
  day: string,
  type: jh.event.type
): jh.event => {
  return { ...event, start: day, end: day, type };
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
