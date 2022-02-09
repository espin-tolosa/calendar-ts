import { event } from "@/interfaces";
import { DateService } from "@/utils/Date";

export const eventSpreader = (event: event) => {
  //  console.clear();
  console.info("Event Spreader", "added new event");
  console.info(event);
  console.info(
    "Dates from start to end",
    DateService.DaysFromStartToEnd(event.start, event.end)
  );
  console.info("Today", event.start);

  const spreadEvent = [];

  let tomorrow = DateService.FormatDate(
    DateService.GetNextDayOfDate(event.start)
  );
  for (
    let day = 0;
    day < DateService.DaysFromStartToEnd(event.start, event.end);
    day++
  ) {
    spreadEvent.push({
      id: -event.id,
      client: "",
      job: "",
      start: tomorrow,
      end: tomorrow,
    });
    tomorrow = DateService.FormatDate(DateService.GetNextDayOfDate(tomorrow));
  }

  console.info(spreadEvent);
  console.info("---------------------------------");

  return spreadEvent;
};
