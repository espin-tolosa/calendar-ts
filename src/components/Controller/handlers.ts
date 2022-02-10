import React, { useState, useRef, useCallback } from "react";

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

//TODO: fix it
const autoCompleteDate = (value: string) => {
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

export const useDate = () => {
  const [date, setDate] = useState("");

  const hOnChange = useCallback(() => {
    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
      setDate(autoCompleteDate(e.currentTarget.value));
    };

    const removeBackSlash = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        setDate(removePrevField);
      }
    };
    return [onChange, removeBackSlash] as [
      typeof onChange,
      typeof removeBackSlash
    ];
  }, []);

  const [onChange, removeBackSlash] = hOnChange();
  return [date, onChange, removeBackSlash] as [
    string,
    typeof onChange,
    typeof removeBackSlash
  ];
};

const hasContent = (textField: string) => {
  return typeof textField !== "undefined" && textField !== "";
};

const removePrevField = (prev: string) => {
  const [yy, mm, dd] = prev.split("-");

  if (hasContent(dd)) return `${yy}-${mm}-`;
  else if (hasContent(mm)) return `${yy}-`;
  else return "";
};
