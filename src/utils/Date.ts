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
  return monthNames[GetMonth(dt)];
}

export function GetDayPad(dt: any) {
  return zeroPad(dt.getDate());
}

export function GetMonthPad(dt: Idt) {
  return zeroPad(1 + dt.getMonth());
}

export function GetYear(dt: Idt) {
  return dt.getFullYear();
}

export function FormatDate(dt: Idt) {
  /*return a Y-M-D used as a date value | output example: "2021/00/01" */
  return `${GetYear(dt)}-${zeroPad(GetMonth(dt))}-${zeroPad(GetDay(dt))}`;
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

function DaysFromStartToEnd(start: string, end: string) {
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
function ComposeDate(year: number, month: number, day: number) {
  return `${fullYear(year, 2000)}-${zeroPadd(month)}-${zeroPadd(day)}`;
}

function GetNextDayOfDate(today: string) {
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

function isValidKeyDate(today: string) {
  const dt = new Date(today);
  return dt.toDateString() !== "Invalid Date";
}

function GetTodayDateFormat() {
  const today = GetDate();
  const day = GetMonthDayKey(today);
  const month = GetMonthKeyName(today);
  const year = GetYear(today);
  const number = GetDay(today);
  return `${day}: ${number} ${month} ${year}`;
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
  DaysFromStartToEnd,
  ComposeDate,
  GetNextDayOfDate,
  isValidKeyDate,
  ExportDateToControllerValue,
};
