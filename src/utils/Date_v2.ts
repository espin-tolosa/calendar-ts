import { zeroPadd } from "./zeroPadd";

type year =
  | "2020"
  | "2021"
  | "2022"
  | "2023"
  | "2024"
  | "2025"
  | "2026"
  | "2027"
  | "2028"
  | "2029"
  | "2030"
  | "2031"
  | "2032"
  | "2033"
  | "2034"
  | "2035"
  | "2036"
  | "2037"
  | "2038"
  | "2039"
  | "2040";

type month =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";

type day =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30"
  | "31";

type ProcessDate = [year, month, day];
type FormattedDate = `${year}-${month}-${day}`;

// function _composeDate
function _composeDate(date: ProcessDate): FormattedDate {
  if (date.length !== 3) {
    throw Error("composeDate recieved wrong input date");
  }
  return `${date[0]}-${date[1]}-${date[2]}`;
}

function _rangeChecker(
  callerName: string,
  value: number,
  minValueAccepted: number,
  maxValueAccepted: number
) {
  if (minValueAccepted > value || value > maxValueAccepted) {
    const message = `${callerName} expects a number value in the range: [${minValueAccepted} - ${maxValueAccepted}]`;
    throw Error(message);
  }
}

function _processDate(dt: Date): ProcessDate {
  const yyyy = dt.getFullYear().toString();
  const mm = zeroPadd(dt.getMonth() + 1);
  const dd = zeroPadd(dt.getDate());
  return [yyyy, mm, dd] as ProcessDate;
}
function _getTodayDay() {
  const today = new Date();
  const p = _processDate(today);
  return parseInt(p.at(2)!);
}

export function _renderToday() {
  const today = new Date();
  const p = _processDate(today);
  return _composeDate(p);
}
export function _renderDate(
  year: number,
  month: number,
  day: number = _getTodayDay()
) {
  _rangeChecker("renderDate", year, 2020, 2040);
  _rangeChecker("renderDate", month, 1, 12);
  _rangeChecker("renderDate", day, 1, 31);

  const monthIndex = month - 1; // Date class expects an index for month input
  const today = new Date(year, monthIndex, day);
  const p = _processDate(today);
  return _composeDate(p);
}
export const isToday = (
  year: number,
  month: number,
  day: number = _getTodayDay()
) => {
  return _renderDate(year, month, day) === _renderToday();
};
