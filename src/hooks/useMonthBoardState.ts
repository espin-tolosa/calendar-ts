import { useState } from "react";
import { DateService } from "../utils/Date";
//TODO: move to env config this constant
const INITIAL_NUMBER_OF_MONTHS = 1;

export function useMonthsBoardState() {
  //Load first element
  const currentMonth = DateService.GetDateNextMonth();
  const monthList = new Array<{ year: number; month: number }>(currentMonth);
  for (let i = 1; i < INITIAL_NUMBER_OF_MONTHS; i++) {
    monthList.push(
      DateService.GetDateNextMonth(
        monthList[i - 1].year,
        monthList[i - 1].month
      )
    );
  }
  //debugger;
  return useState(monthList);
}
