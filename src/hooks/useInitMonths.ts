import { useState } from "react";
import { DateService } from "@/utils/Date";

export function useInitMonths(length: number) {
  //Case for one month
  if (length <= 1) {
    return useState([DateService.GetDateNextMonth()]);
  }

  //Case for many months, here length is > 1

  //Load first element
  const monthList = [DateService.GetDateNextMonth()];
  for (let i = 1; i < length; i++) {
    monthList.push(
      DateService.GetDateNextMonth(
        monthList[i - 1].year,
        monthList[i - 1].month
      )
    );
  }
  return useState(monthList);
}
