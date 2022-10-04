// This utilities are extracted from the old handler controller

// removePrevField: can remove one entire field such as: year, month, day
// the three output possibilites are:
//
// yy-mm-dd -> yy-mm
// yy-mm    -> yy
// yy       ->

export const removePrevField = (prev: string) => {
  const [yy, mm, dd] = prev.split("-");

  if (hasContent(dd)) return `${yy}-${mm}-`;
  else if (hasContent(mm)) return `${yy}-`;
  else return "";
};

// autoCompleteDate: writes the separator character in the date
// following the format: yy-mm-dd
//
// it checks if the input is valid

export const autoCompleteDate = (value: string) => {
  const [year, month, day] = value.split("-");

  if (isNumber(value[value.length - 1])) {
    if (isValidYear(year || "") && value.length === 2) {
      return `${year}-`;
    }
    if (isValidMonth(month || "") && value.length === 5) {
      return `${year}-${month}-`;
    } else if (!isValidMonth(month || "") && value.length === 7) {
      return `${year}-`;
    }
  }

  if (value.length === 8 && !isValidDay(day)) {
    return `${year}-${month}-`;
  }

  return value.substring(0, 10);
};

//- Utilities --------------------------
const hasContent = (textField: string) => {
  return typeof textField !== "undefined" && textField !== "";
};

const isNumber = (value: string) => {
  const result = Number(value);
  return result === result;
};

const isValidYear = (year: string) => {
  const yearNumber = Number(year);
  return yearNumber >= 1 && yearNumber <= 99;
};

const isValidMonth = (month: string) => {
  const monthNumber = Number(month);
  return month.length === 2 && monthNumber >= 1 && monthNumber <= 12;
};

const isValidDay = (day: string) => {
  const dayNumber = Number(day);
  return day.length === 2 && dayNumber >= 1 && dayNumber <= 31;
};
