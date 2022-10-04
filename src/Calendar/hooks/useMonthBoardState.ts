import { useState } from "react";
import { DateService, ListNextDates, ListPrevDates } from "../utils/Date";
//TODO: move to env config this constant
const NUMBER_OF_MONTHS = 1;

export function useMonthsBoardState() {
  //Load first element
  const currentDate: jh.date.monthData = DateService.GetDateNextMonth();
  const pastDates = ListPrevDates(currentDate, NUMBER_OF_MONTHS);
  const nextDates = ListNextDates(currentDate, NUMBER_OF_MONTHS);
  //debugger;
  return useState<jh.date.monthData[]>([...pastDates, currentDate, ...nextDates]);
}
