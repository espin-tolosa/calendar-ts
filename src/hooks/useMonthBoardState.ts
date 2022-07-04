import { useState } from "react";
import { DateService, ListPrevDates } from "../utils/Date";
//TODO: move to env config this constant
const NUMBER_OF_PREV_MONTHS = 2;

export function useMonthsBoardState() {
  //Load first element
  const currentDate: yearMonth = DateService.GetDateNextMonth();
  const pastDates: yearMonth[] = ListPrevDates(
    currentDate,
    NUMBER_OF_PREV_MONTHS
  );
  //debugger;
  return useState<yearMonth[]>([...pastDates, currentDate]);
}
