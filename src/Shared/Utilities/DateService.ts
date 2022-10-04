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

export function GetMonthDayKey(dt: Idt) {
  /*return a string in en-GB format | output example: "Monday, 21 June 2021" */
  //const options = { weekday: "long" };
  //return dt.toLocaleDateString("en-GB", options);
  return Intl.DateTimeFormat("en-GB", {
    weekday: "long",
  }).format(dt);
}

export function GetMonth(dt: Idt) {
  return 1 + dt.getMonth();
}

export function GetMonthKeyName(dt: Idt) {
  return monthNames[GetMonth(dt) - 1]; //index of array starts at 0
}

export function GetYear(dt: Idt) {
  return dt.getFullYear();
}

export function GetDay(dt: Idt) {
  return dt.getDate();
}

export function GetTodayDateFormat() {
  const today = GetDate();
  const day = GetMonthDayKey(today);
  const month = GetMonthKeyName(today);
  const year = GetYear(today);
  const number = GetDay(today);
  return `${day} ${number} ${month} ${year}`;
}