import "@/App.css";
import { Styles_Headers_Day } from "@styles/Headers/Day";
import { Styles_Bodies_DayEnd } from "@styles/Bodies/Day";
import { Styles_Bodies_Day } from "@styles/Bodies/Day";
import { Styles_Headers_Month } from "@styles/Headers/Month";
import { Styles_Headers_Board_Row } from "./styles/Headers/Board";

import { Event } from "@components/Event";
import { Board } from "@components/Form";

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const events = ["event1", "event2"];
function App() {
  //const []

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
      <div className="App">
        <Board />
        <div className="bg-white md:py-8 px-4 lg:max-w-7xl lg:mx-auto lg:px-8">
          <Styles_Headers_Month>March 2021</Styles_Headers_Month>
          <div className="inline-flex flex-col space-y-1 items-start justify-start h-full w-full">
            <div className="inline-flex space-x-28 items-start justify-start pr-24 h-full w-full">
              {dayNames.map((day) => (
                <Styles_Headers_Day key={day}>{day}</Styles_Headers_Day>
              ))}
            </div>
            <div className="flex flex-col items-start justify-start">
              {/* row 0 */}
              <Styles_Headers_Board_Row>
                {dayListRow0.map((day) => {
                  return day < 0 ? (
                    <Styles_Bodies_DayEnd key={day}>
                      {Math.abs(day)}{" "}
                    </Styles_Bodies_DayEnd>
                  ) : (
                    <Styles_Bodies_Day key={day}>{day}</Styles_Bodies_Day>
                  );
                })}
              </Styles_Headers_Board_Row>
              {/* row 1 */}
              <Styles_Headers_Board_Row>
                {dayListRow1.map((day) => (
                  <Styles_Bodies_Day key={day}>{day}</Styles_Bodies_Day>
                ))}
              </Styles_Headers_Board_Row>
              {/* row 2 */}
              <Styles_Headers_Board_Row>
                {dayListRow2.map((day) => (
                  <Styles_Bodies_Day key={day}>{day}</Styles_Bodies_Day>
                ))}
              </Styles_Headers_Board_Row>
              {/* row 3 */}
              <Styles_Headers_Board_Row>
                {dayListRow3.map((day) => (
                  <Styles_Bodies_Day key={day}>{day}</Styles_Bodies_Day>
                ))}
              </Styles_Headers_Board_Row>
              {/* row 4 */}
              <Styles_Headers_Board_Row>
                {dayListRow4.map((day) => {
                  return day < 0 ? (
                    <Styles_Bodies_DayEnd key={day}>
                      {Math.abs(day)}{" "}
                    </Styles_Bodies_DayEnd>
                  ) : (
                    <Styles_Bodies_Day key={day}>{day}</Styles_Bodies_Day>
                  );
                })}
              </Styles_Headers_Board_Row>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
