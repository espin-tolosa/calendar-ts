import React, { useState, useRef } from "react";

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

  /*
	if (!isNumber(value[value.length - 1])) return "";
  if (date.length === 3) {
		return value.slice(0, -1);
  }
  if (date.length === 3 && isValidDay(date[2])) {
		return `${value}/`;
  }
  if (date.length === 2 && isValidMonth(date[1])) {
		return `${value}/`;
  }
  if (date.length === 1 && isValidYear(date[0])) {
		return `${value}/`;
  }
	*/
  return value.substring(0, 10);
};

export const useDate = () => {
  const [date, setDate] = useState("");

  const hOnChange = () => {
    const lock = useRef(false); //lock onChange runtime when onKey detect Backslash
    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
      if (!lock.current) {
        setDate(autoCompleteDate(e.currentTarget.value));
      }
    };
    const removeBackSlash = (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log(e.key);
      if (e.key === "Backspace") {
        setDate((prev) => {
          const [y, m, d] = prev.split("-");
          if (d) {
            if (m === "") {
              return `${y}-`;
            } else {
              return `${y}-${m}-`;
            }
          } else if (m) {
            if (m === "") {
              return "";
            } else {
              return `${y}-`;
            }
          } else {
            return "";
          }
        });
        lock.current = true;
      } else {
        lock.current = false;
      }
    };
    return [onChange, removeBackSlash] as [
      typeof onChange,
      typeof removeBackSlash
    ];
  };
  const [onChange, removeBackSlash] = hOnChange();
  return [date, onChange, removeBackSlash] as [
    string,
    typeof onChange,
    typeof removeBackSlash
  ];
};
