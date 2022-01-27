import { useState } from "react";

import {
  GetMonthDayKey,
  GetLastDayMonth,
  GetDate,
  ToFormattedMonth,
} from "../services/Date";

export const WeekDays = {
  Monday: 7,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

export function useMonthDate(year, month) {
  const newDate = recomputeDates(year, month);
  return useState(newDate);
}

export function recomputeDates(year, month) {
  const date = GetDate(year, month);
  const daysOfMonth = GetLastDayMonth(date);
  const monthDayKey = GetMonthDayKey(date);

  return {
    now: date,
    year: year,
    month: month,

    dateFormat: ToFormattedMonth(date),
    daysList: createListOfDays(daysOfMonth),
    padding: WeekDays[monthDayKey],
  };
}

function createListOfDays(lastDay) {
  return Array.from({ length: lastDay }, (_, i) => i + 1);
}
