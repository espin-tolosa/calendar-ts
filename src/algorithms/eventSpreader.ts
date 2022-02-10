import { event } from "@/interfaces";
import { DateService } from "@/utils/Date";

export const eventSpreader = (event: event) => {
  const spreadEvent: Array<event> = [];

  let tomorrow = DateService.FormatDate(
    DateService.GetNextDayOfDate(event.start)
  );
  for (
    let day = 0;
    day < DateService.DaysFromStartToEnd(event.start, event.end);
    day++
  ) {
    const dayWeek = DateService.GetMonthDayKey(new Date(tomorrow));
    if (dayWeek === "Monday") {
      spreadEvent.push({
        id: event.id,
        client: event.client,
        job: event.job,
        start: tomorrow,
        end: event.end,
      });
    } else {
      spreadEvent.push({
        id: -event.id,
        client: event.client,
        job: event.job,
        start: tomorrow,
        end: tomorrow,
      });
    }
    tomorrow = DateService.FormatDate(DateService.GetNextDayOfDate(tomorrow));
  }

  return spreadEvent;
};
