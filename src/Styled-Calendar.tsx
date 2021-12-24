import { useState, useContext } from "react";
import tw from "tailwind-styled-components";
import "@/App.css";
//import { Styles_Headers_Day } from "@styles/Styled_Day";
import { WeekDay } from "./styles/Styled_Day";
import { Styles_Bodies_Day } from "@styles/Styled_Day";
import { Styles_Bodies_DayEnd } from "@styles/Bodies/Day";
//import { Styles_Bodies_Day } from "@styles/Bodies/Day";
import { Styles_Headers_Month } from "@styles/Headers/Month";
import { Styles_Headers_Board_Row } from "@styles/Headers/Board";

import { Event } from "@components/Event";
import { Day } from "@components/Day";
import { DayMove } from "@components/Day-move";
import { Board } from "@components/Form";
import { Styles_Bodies_Event } from "@styles/Bodies/Events";

//import { FormDataContext } from "@context/formdata";
import { CtxProvider } from "@context/formdata";
import { CtxEventProvider } from "@context/eventsarray";
import { EventsCtx } from "@context/eventsarray";

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function StyledCalendar() {
  const dayList = [
    -28, -29, -30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, -1, -2, -3, -4, -5, -6,
  ];
  const dayListRow0 = dayList.slice(0, 0 + 7);
  const dayListRow1 = dayList.slice(7, 7 + 7);
  const dayListRow2 = dayList.slice(7 + 7, 7 + 7 + 7);
  const dayListRow3 = dayList.slice(7 + 7 + 7, 7 + 7 + 7 + 7);
  const dayListRow4 = dayList.slice(7 + 7 + 7 + 7, 7 + 7 + 7 + 7 + 7);
  return (
    <>
      <nav className="bg-palette-cc border border-palette-ri ">
        <div className="max-w-3xl mx-auto px-5 bg-palette-rm ">
          <div>Logo</div>
          <div>Logo</div>
          <div>Logo</div>
        </div>
      </nav>
    </>
  );
}

export default StyledCalendar;
