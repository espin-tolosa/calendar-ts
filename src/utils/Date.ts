function zeroPad(num: number, places = 2) {
  return String(num).padStart(places, "0");
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

export const DateService = {
  GetDate: GetDate,
  GetDateNextMonth: GetDateNextMonth,
  GetMonth: GetMonth,
  GetYear: GetYear,
  FormatDate: FormatDate,
  GetLastDayMonth: GetLastDayMonth,
  ToFormattedMonth: ToFormattedMonth,
  GetMonthDayKey: GetMonthDayKey,
};