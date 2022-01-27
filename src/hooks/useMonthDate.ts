import { useState } from "react";

import {
  GetMonthDayKey,
  GetLastDayMonth,
  GetDate,
  ToFormattedMonth,
} from "@/utils/Date";

export const WeekDays = {
  Monday: 7,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

export function useMonthDate(year: number, month: number) {
  const newDate = recomputeDates(year, month);
  return useState(newDate)[0];
}

export function recomputeDates(year: number, month: number) {
  const date = GetDate(year, month);
  const daysOfMonth = GetLastDayMonth(date);
  const monthDayKey = GetMonthDayKey(date);

  return {
    now: date,
    year: year,
    month: month,

    dateFormat: ToFormattedMonth(date),
    daysList: createListOfDays(daysOfMonth),
    start: String(monthDayKey.toLowerCase()).substring(0, 3),
  };
}

function createListOfDays(lastDay: number) {
  return Array.from({ length: lastDay }, (_, i) => i + 1);
}
