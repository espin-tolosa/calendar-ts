function zeroPad(num, places = 2) {
  return String(num).padStart(places, "0");
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Interface for Javascript Date API
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function GetDate(y, m, d) {
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

export function GetDateNextMonth({ year, month } = {}) {
  const dt_new = GetDate(year, month + 1);
  const y_next = GetYear(dt_new);
  const m_next = GetMonth(dt_new);
  return { year: y_next, month: m_next };
}

export function GetLastDayMonth(dt) {
  /*user Input Jan = 1*/
  return GetDay(new Date(GetYear(dt), GetMonth(dt), 0));
}

export function GetDay(dt) {
  return dt.getDate();
}

export function GetMonth(dt) {
  return 1 + dt.getMonth();
}
export function GetDayPad(dt) {
  return zeroPad(dt.getDate());
}

export function GetMonthPad(dt) {
  return zeroPad(1 + dt.getMonth());
}

export function GetYear(dt) {
  return dt.getFullYear();
}

export function FormatDate(dt) {
  /*return a Y-M-D used as a date value | output example: "2021/00/01" */
  return `${GetYear(dt)}-${zeroPad(GetMonth(dt))}-${zeroPad(GetDay(dt))}`;
}

export function GetMonthDayKey(dt) {
  /*return a string in en-GB format | output example: "Monday, 21 June 2021" */
  const options = { weekday: "long" };
  return dt.toLocaleDateString("en-GB", options);
}
export function ToFormattedMonth(dt) {
  /*return a string in en-GB format | output example: "Monday, 21 June 2021" */
  const options = { year: "numeric", month: "long" };
  return dt.toLocaleDateString("en-GB", options);
}
export function ToFormattedDate(dt) {
  /*return a string in en-GB format | output example: "Monday, 21 June 2021" */
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return dt.toLocaleDateString("en-GB", options);
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
