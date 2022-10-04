type Idt = globalThis.Date;
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

/**
 * Tested in GetTodayDateFormat
 */
function GetMonthDayKey(dt: Idt) {
  return Intl.DateTimeFormat("en-GB", {
    weekday: "long",
  }).format(dt);
}

function GetMonth(dt: Idt) {
  return 1 + dt.getMonth();
}

/**
 * Tested in GetTodayDateFormat
 */
function GetMonthKeyName(dt: Idt) {
  return monthNames[GetMonth(dt) - 1]; //index of array starts at 0
}

/**
 * Tested in GetTodayDateFormat
 */
function GetYear(dt: Idt) {
  return dt.getFullYear();
}
/**
 * Tested in GetTodayDateFormat
 */
function GetDay(dt: Idt) {
  return dt.getDate();
}

/**
 * It is a function used by the header to display the date of today
 * with a style proper of GB language
 * @param today 
 * @returns a date formatted as: Thursday 29 February 2024
 */
export function GetTodayDateFormat(today = new Date()) {
  const day = GetMonthDayKey(today);
  const month = GetMonthKeyName(today);
  const year = GetYear(today);
  const number = GetDay(today);
  return `${day} ${number} ${month} ${year}`;
}