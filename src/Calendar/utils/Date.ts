import { zeroPadd } from "./zeroPadd";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function secondsSinceEpoch() {
  return Math.floor(Date.now() / 1000);
}

function zeroPad(num: number, places = 2) {
  return String(num).padStart(places, "0");
}

function fullYear(yy: number, groundMillenium: number) {
  return (yy < 100 ? groundMillenium : 0) + yy;
}

type Idt = globalThis.Date;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Interface for Javascript Date API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function GetDate(y?: number, m?: number, d?: number) {
  if (
    typeof y !== "undefined" &&
    typeof m !== "undefined" &&
    typeof d !== "undefined"
  ) {
    return new Date(y, m - 1, d);
  } else if (
    typeof y !== "undefined" &&
    typeof m !== "undefined" &&
    typeof d === "undefined"
  ) {
    return new Date(y, m - 1, 1);
  } else {
    return new Date();
  }
}

export function ExportDateToControllerValue(date: string) {
  const fields = date.split("-");
  if (fields.length !== 3) {
    return "";
  }

  return `${fields[2]} | ${fields[1]} | ${parseInt(fields[0])}`;
}

export function GetDateNextMonth(year?: number, month?: number) {
  const dt_new = GetDate(year, Number(month) + 1);
  const y_next = GetYear(dt_new);
  const m_next = GetMonth(dt_new);
  return { year: y_next, month: m_next };
}

export function GetLastDayMonth(dt: Idt) {
  /*user Input Jan = 1*/
  return GetDay(new Date(GetYear(dt), GetMonth(dt), 0));
}

export function GetDay(dt: Idt) {
  return dt.getDate();
}

export function GetMonth(dt: Idt) {
  return 1 + dt.getMonth();
}

export function GetMonthKeyName(dt: Idt) {
  return monthNames[GetMonth(dt) - 1]; //index of array starts at 0
}

export function GetDayPad(dt: Idt) {
  return zeroPad(dt.getDate());
}

export function GetMonthPad(dt: Idt) {
  return zeroPad(1 + dt.getMonth());
}

export function GetYear(dt: Idt) {
  return dt.getFullYear();
}

export function FormatDate(dt: Idt) {
  return `${GetYear(dt)}-${zeroPad(GetMonth(dt))}-${zeroPad(GetDay(dt))}`;
}

//Returns the index of day of the week as following
//Monday:0, ...,Saturday:5, Sunday: 6
export function GetDayWeekIndex(date: string) {
  const isSunday = (index: number) => (index === 0 ? true : false);
  const dt = new Date(date);
  const index = dt.getDay();
  return isSunday(index) ? 6 : index - 1;
}

export function GetMonthDayKey(dt: Idt) {
  /*return a string in en-GB format | output example: "Monday, 21 June 2021" */
  //const options = { weekday: "long" };
  //return dt.toLocaleDateString("en-GB", options);
  return Intl.DateTimeFormat("en-GB", {
    weekday: "long",
  }).format(dt);
}
export function ToFormattedMonth(dt: Idt) {
  /*return a string in en-GB format | output example: "Monday, 21 June 2021" */
  //const options = { year: "numeric", month: "long" };
  //return dt.toLocaleDateString("en-GB", options);
  return Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
  }).format(dt);
}
export function ToFormattedDate(dt: Idt) {
  /*return a string in en-GB format | output example: "Monday, 21 June 2021" */
  // const options = {
  //   weekday: "long",
  //   year: "numeric",
  //   month: "long",
  //  day: "numeric",
  //};
  //return dt.toLocaleDateString("en-GB", options);
  return Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dt);
}

export function DaysFrom(start: string, end: string) {
  const dtStart = new Date(start);
  const dtEnd = new Date(end);

  const endUTC = Date.UTC(
    dtEnd.getFullYear(),
    dtEnd.getMonth(),
    dtEnd.getDate()
  );

  const startUTC = Date.UTC(
    dtStart.getFullYear(),
    dtStart.getMonth(),
    dtStart.getDate()
  );

  const day = 1000 * 60 * 60 * 24;
  return (endUTC - startUTC) / day;
}

//convert a triad of numbers representing: year, month, day as: 22,12,01
//in a string fully formatted as: 2022-12-01
export function ComposeDate(year: number, month: number, day: number) {
  return `${fullYear(year, 2000)}-${zeroPadd(month)}-${zeroPadd(day)}`;
}

export function GetNextDayOfDate(today: string) {
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

export function isValidKeyDate(today: string) {
  const dt = new Date(today);
  return dt.toDateString() !== "Invalid Date";
}

export function GetTodayDateFormat() {
  const today = GetDate();
  const day = GetMonthDayKey(today);
  const month = GetMonthKeyName(today);
  const year = GetYear(today);
  const number = GetDay(today);
  return `${day} ${number} ${month} ${year}`;
}

export function GetDayNumberOfDay(name: string) {
  const names = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  return names.findIndex((n) => n === name) + 1;
}

export function GetPrevDate(startDate: { year: number; month: number }) {
  const state = { ...startDate };
  const substractOneYear = () => {
    state.year -= 1;
    state.month = 12;
  };
  const substractOneMonth = () => {
    state.month -= 1;
  };

  return () => {
    state.month === 1 ? substractOneYear() : substractOneMonth();
    return { ...state };
  };
}

export function ListPrevDates(
  start: jh.date.monthData,
  length: number
): Array<jh.date.monthData> {
  const prevState = GetPrevDate(start);
  const result: Array<jh.date.monthData> = [];
  for (let i = 0; i != length; i++) {
    result.push(prevState());
  }

  return result.reverse();
}

export function GetNextDate(startDate: { year: number; month: number }) {
  const state = { ...startDate };
  const addOneYear = () => {
    state.year += 1;
    state.month = 1;
  };
  const addOneMonth = () => {
    state.month += 1;
  };

  return () => {
    state.month === 12 ? addOneYear() : addOneMonth();
    return { ...state };
  };
}

export function ListNextDates(
  start: jh.date.monthData,
  length: number
): Array<jh.date.monthData> {
  const prevState = GetNextDate(start);
  const result: Array<jh.date.monthData> = [];
  for (let i = 0; i != length; i++) {
    result.push(prevState());
  }

  return result;
}

function GetDateFrom(fullDate: string, offset: number) {
  //  const today = new Date(fullDate);
  //  const previous = new Date(today.getTime() + offset);
  //  debugger;
  //  return FormatDate(previous);

  const dt = new Date(fullDate);
  const copy = new Date(dt.valueOf());
  const newDate = new Date(copy.setDate(copy.getDate() + offset));
  const result = FormatDate(newDate);
  return result;
}

function GetWeekRangeOf(today: string) {
  const dayIndexLeft = DateService.GetDayWeekIndex(today);
  const dayIndexRight = 6 - dayIndexLeft;
  const dayNumber = parseInt(today.split("-")[2]);
  const toLastMonday = Math.min(dayNumber, dayIndexLeft);
  const daysLeftTillEndOfMonth =
    DateService.GetLastDayMonth(new Date(today)) - dayNumber;
  const toNextSunday = Math.min(daysLeftTillEndOfMonth, dayIndexRight);
  const from = DateService.GetDateFrom(today, -toLastMonday);
  const to = DateService.GetDateFrom(today, toNextSunday);
  const rangeDates = { from, to };
  return rangeDates;
}

// TODO: all clients of this function should be refactored to remove this dependency
function IsWeekend(today: string) {
  return false;
}

function IsWeekend_v2(today: string) {
    const today_name = DateService.GetMonthDayKey(new Date(DateService.GetDateFrom(today, 0)));

  return (
    today_name.includes("Sun") || today_name.includes("Sat")
  );
}

//enum 
export enum DayWeek {
    Monday = 0,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
  }

function GetDateNextDay(today: string, target: DayWeek) {
  target %= 7; //convert to: 0 (sunday), 1 (monday), ..., 6 (saturday)
  let nextDay = GetDateFrom(today, 1);
  let day = GetDayWeekIndex(nextDay);
  while (day !== target) {
    nextDay = GetDateFrom(nextDay, 1);
    day = GetDayWeekIndex(nextDay);
  }

  return nextDay;
}

export const DateService = {
  GetDate,
  GetTodayDateFormat,
  GetDateNextMonth,
  GetDay,
  GetMonth,
  GetMonthKeyName,
  GetYear,
  FormatDate,
  GetLastDayMonth,
  ToFormattedMonth,
  GetMonthDayKey,
  DaysFrom,
  ComposeDate,
  GetNextDayOfDate,
  isValidKeyDate,
  ExportDateToControllerValue,
  GetDayNumberOfDay,
  GetPrevDate,
  secondsSinceEpoch,
  GetDateFrom,
  GetDayWeekIndex,
  GetWeekRangeOf,
  IsWeekend,
  IsWeekend_v2,
  GetDateNextDay,
};
