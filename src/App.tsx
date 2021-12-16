import "./App.css";
import { Styles_Headers_Day } from "./styles/Headers/Day";
import { Styles_Bodies_DayEnd } from "./styles/Bodies/Day";
import { Styles_Bodies_Day } from "./styles/Bodies/Day";
import { Styles_Headers_Month } from "./styles/Headers/Month";

import { Event } from "./components/Event";

function App() {
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

  const dayList = Array.from(Array(7).keys());
  return (
    <>
      <div className="App">
        <div className="bg-white md:py-8 px-4 lg:max-w-7xl lg:mx-auto lg:px-8">
          <Styles_Headers_Month>March 2021</Styles_Headers_Month>
          <div className="inline-flex flex-col space-y-1 items-start justify-start h-full w-full">
            <div className="inline-flex space-x-28 items-start justify-start pr-24 h-full w-full">
              {dayNames.map((day) => (
                <Styles_Headers_Day key={day}>{day}</Styles_Headers_Day>
              ))}
            </div>
            <div className="flex flex-col items-start justify-start">
              <div className="inline-flex items-center justify-start h-full w-full">
                {dayList.map((day) => (
                  <Styles_Bodies_Day key={day}>
                    {events.map((e) => (
                      <Event key={e} job={e} />
                    ))}
                  </Styles_Bodies_Day>
                ))}
              </div>
              <div className="inline-flex items-center justify-start w-full h-full">
                {dayList.map((day) => (
                  <Styles_Bodies_Day key={day}>{day}</Styles_Bodies_Day>
                ))}
              </div>
              <div className="inline-flex items-center justify-start w-full h-full">
                {dayList.map((day) => (
                  <Styles_Bodies_Day key={day}>{day}</Styles_Bodies_Day>
                ))}
              </div>
              <div className="inline-flex items-center justify-start h-full w-full">
                {dayList.map((day) => (
                  <Styles_Bodies_Day key={day}>{day}</Styles_Bodies_Day>
                ))}
              </div>
              <div className="inline-flex items-center justify-start w-full h-full">
                {dayList.map((day) => (
                  <Styles_Bodies_DayEnd key={day}>{day}</Styles_Bodies_DayEnd>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
