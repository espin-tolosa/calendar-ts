import { DateService } from "@/utils/Date";

export const totalCellsInLastRow = (start: string, length: number) => {
  const DayStart = DateService.GetDayNumberOfDay(start);
  let startRows = 4; //it's the minimun ever when feb starts on monday 28days/7cols = 4rows
  let diff = startRows * 7 - DayStart - length + 1;
  while (diff <= 0 && diff !== -7) {
    diff = 7 * ++startRows - DayStart - length + 1;
  }
  const restOfDays = Array.from({ length: diff }, (_, i) => i + 1);

  const leftOfDays = Array.from({ length: DayStart - 1 }, (_, i) => i + 1);

  return [leftOfDays, restOfDays];
};
