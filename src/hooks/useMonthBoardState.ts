import { useState } from "react";
import { DateService, ListPrevDates } from "../utils/Date";
//TODO: move to env config this constant
const NUMBER_OF_PREV_MONTHS = 2;

export function useMonthsBoardState() {
  //Load first element
  const currentDate: jh.date.monthData = DateService.GetDateNextMonth();
  const pastDates: jh.date.monthData[] = ListPrevDates(
    currentDate,
    NUMBER_OF_PREV_MONTHS
  );
  //debugger;
  return useState<jh.date.monthData[]>([...pastDates, currentDate]);
}
