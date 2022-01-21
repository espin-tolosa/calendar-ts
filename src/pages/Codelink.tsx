import React, { useEffect, useState, useRef } from "react";
import tw from "tailwind-styled-components";
import "@styles/codelink.css";

import { TW_header, TW_container } from "@/components/Day/tw";

interface eventType {
  id: number;
  client: string;
  start: number;
  job: string;
}

const events0 = [{ id: 0, start: 0, job: "" }];

const events1 = [
  { id: 1, client: "John", start: 1, job: "Starting 1 - 1" },
  { id: 2, client: "Cristine", start: 1, job: "Starting 1 - 1" },
  { id: 4, client: "Marcel", start: 2, job: "Starting 2 - 1" },
  { id: 3, client: "Bob", start: 11, job: "Starting 3 - 1" },
  { id: 4, client: "Cristine", start: 20, job: "Starting 4 - 1" },
];
const events2 = [
  { id: 3, client: "Xin", start: 7, job: "Starting 1 - 2" },
  { id: 2, client: "John", start: 7, job: "Starting 2 - 2" },
  { id: 5, client: "Cristine", start: 10, job: "Starting 3 - 2" },
  { id: 1, client: "Bob", start: 26, job: "Starting 4 - 2" },
];
const events_test = [
  { id: 1, client: "John", start: 6, job: "Starting 1 - 2" },
  { id: 2, client: "John", start: 6, job: "Starting 2 - 2" },
  { id: 3, client: "John", start: 6, job: "Starting 3 - 2" },
  { id: 4, client: "John", start: 6, job: "Starting 4 - 2" },
  { id: 5, client: "John", start: 6, job: "Starting 5 - 2" },
  { id: 6, client: "John", start: 6, job: "Starting 6 - 2" },
  { id: 7, client: "John", start: 6, job: "Starting 7 - 2" },

  { id: 7, client: "John", start: 6, job: "Starting 7 - 2" },
  { id: 6, client: "John", start: 6, job: "Starting 6 - 2" },
  { id: 5, client: "John", start: 6, job: "Starting 5 - 2" },
  { id: 4, client: "John", start: 6, job: "Starting 4 - 2" },
  { id: 3, client: "John", start: 6, job: "Starting 3 - 2" },
  { id: 2, client: "John", start: 6, job: "Starting 2 - 2" },
  { id: 1, client: "John", start: 6, job: "Starting 1 - 2" },

  { id: 1, client: "John", start: 22, job: "Starting 1 - 2" },
  { id: 2, client: "John", start: 22, job: "Starting 2 - 2" },
  { id: 3, client: "John", start: 22, job: "Starting 3 - 2" },
  { id: 4, client: "John", start: 22, job: "Starting 4 - 2" },
  { id: 5, client: "John", start: 22, job: "Starting 5 - 2" },
  { id: 6, client: "John", start: 22, job: "Starting 6 - 2" },
  { id: 7, client: "John", start: 22, job: "Starting 7 - 2" },

  { id: 7, client: "John", start: 22, job: "Starting 7 - 2" },
  { id: 6, client: "John", start: 22, job: "Starting 6 - 2" },
  { id: 5, client: "John", start: 22, job: "Starting 5 - 2" },
  { id: 4, client: "John", start: 22, job: "Starting 4 - 2" },
  { id: 3, client: "John", start: 22, job: "Starting 3 - 2" },
  { id: 2, client: "John", start: 22, job: "Starting 2 - 2" },
  { id: 1, client: "John", start: 22, job: "Starting 1 - 2" },
];

function DayStart({ weekday }: { weekday: string }) {
  const options = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  if (!options.some((opt) => opt === weekday)) {
    console.warn(
      "DayStart: weekday " +
        weekday +
        " is not an option, defaulted to mon, options are:",
      options
    );
    weekday = "mon";
  }

  const classNameTemplate = `month-start-${weekday}`;
  return <div className={classNameTemplate}></div>;
}

const TW_Event_FlexContainer = tw.div`
  flex
  flex-col
	justify-start
	`;

const TW_Event = tw.div<{ $cells: number }>`
	absolute
	whitespace-nowrap
	overflow-hidden
	overflow-ellipsis
	pl-2
	text-white
	rounded-full
	ml-[0.1rem]

	${({ $cells }) =>
    ($cells === 1 && "event-span-1") ||
    ($cells === 2 && "event-span-2") ||
    ($cells === 3 && "event-span-3") ||
    ($cells === 4 && "event-span-4") ||
    ($cells === 5 && "event-span-5") ||
    ($cells === 6 && "event-span-6") ||
    ($cells === 7 && "event-span-7") ||
    "extend-event-1"}
`;

const TW_Event_Extend = tw.div<{ $cells: number }>`
	absolute
	text-transparent
	cursor-copy
	min-w-[7.14%]
	z-ExtendEvent

	${({ $cells }) =>
    ($cells === 1 && "extend-event-1") ||
    ($cells === 2 && "extend-event-2") ||
    ($cells === 3 && "extend-event-3") ||
    ($cells === 4 && "extend-event-4") ||
    ($cells === 5 && "extend-event-5") ||
    ($cells === 6 && "extend-event-6") ||
    ($cells === 7 && "extend-event-7") ||
    "extend-event-1"}
`;

const TW_Event_Placeholder = tw.div`
text-transparent	
my-0.5
`;

const Day = ({ day, events }: { day: number; events: Array<eventType> }) => {
  const tempDay = String(day);
  const dayPadd = day < 10 ? `0${tempDay}` : tempDay;
  /*
  const styles = {
    backgroundColor: "white"
  } as const;
style={styles} */

  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //day-off
  let top = false;
  if (day <= 5 && day >= 3) {
    top = true;
  } else {
    top = false;
  }

  //TODO: Create a Context
  const giveMeColor = (client: string) => {
    const linearGradientTemplate = (color: number) => {
      return `linear-gradient(0.25turn, hsl(${color}, 40%, 40%), hsl(${color},50%,50%),  hsl(${color}, 60%, 60%))`;
    };

    const highContrastText = (bgColor: number) => {
      // hsl system colors are in range [0º, 360º]
      return "white";
    };

    if (client === "John") {
      return {
        background: linearGradientTemplate(10),
        color: highContrastText(10),
      };
    } else if (client === "Cristine") {
      return {
        background: linearGradientTemplate(20),
        color: highContrastText(20),
      };
    } else if (client === "Xin") {
      return {
        background: linearGradientTemplate(30),
        color: highContrastText(30),
      };
    } else {
      return {
        background: linearGradientTemplate(350),
        color: highContrastText(350),
      };
    }
  };

  return (
    <TW_container
      top={top}
      onMouseUp={() => {
        console.log("leaving action at day:", dayPadd);
      }}
      onMouseEnter={() => console.log("passing over:", dayPadd)}
    >
      <TW_header>
        <div className="flex justify-center items-center px-4 w-[1.6rem] rounded-full bg-gray-200">
          {dayPadd}
        </div>
      </TW_header>

      {events
        .filter((evt) => evt.start === day)
        .map((evt) => {
          return (
            <>
              <TW_Event_FlexContainer>
                <TW_Event
                  style={giveMeColor(evt.client)}
                  key={evt.id}
                  $cells={evt.id}
                  onMouseDownCapture={() => {
                    console.log("Event:", evt.job);
                  }}
                  title={`${evt.client}: ${evt.job} from: ${evt.start} to ${evt.start}`}
                >
                  {`${evt.client}: ${evt.job}`}
                </TW_Event>
                <TW_Event_Extend
                  $cells={evt.id}
                  onMouseDownCapture={() => {
                    console.log("extend event:", evt.id);
                  }}
                  onMouseEnter={() => {
                    console.log("enter extend event");
                  }}
                  onMouseOut={() => {
                    console.log("leaving extend event");
                  }}
                  title={`Drag here to extend ${evt.client}\'s job`}
                >
                  {">"}
                </TW_Event_Extend>
                <TW_Event_Placeholder key={"p" + evt.id}>
                  {"-"}
                </TW_Event_Placeholder>
              </TW_Event_FlexContainer>
            </>
          );
        })}
    </TW_container>
  );
};

const DaySpot = ({ day }: { day: number }) => {
  const tempDay = String(day);
  const dayPadd = day < 10 ? `0${tempDay}` : tempDay;

  /*
  display: flex;
  justify-content: center;
  margin: 1px;
  border-radius: 100px;
  padding: 1px;
  background: lightblue;

*/

  return <div className="rounded-full bg-black text-white">{dayPadd}</div>;
};

export default function App(): JSX.Element {
  const days = Array.from(Array(30).keys()).map((day) => day + 1);

  const CreateEvent = () => {
    return (
      <form
        className="
				sm:portrait:flex sm:portrait:flex-col sm:portrait:gap-4 sm:portrait:px-4
				sm:landscape:flex sm:landscape:flex-col sm:landscape:gap-4 sm:landscape:px-4
				landscape:hidden
				  portrait:hidden "
        action="post"
      >
        <input
          className="bg-white border-none p-1 rounded-full cursor-pointer mt-2 font-extra button-shadow"
          type="submit"
          value="Create"
        />

        <div className="flex justify-evenly flex-wrap flex-grow-0 flex-shrink basis-full py-1 ">
          <input
            className="width-clamp text-center button-shadow text-effect"
            type="text"
            name="start"
            id="start"
            value=""
            placeholder="init date"
            title="input: dd/mm/yyyy, also accepts: dd/mm/yy"
          />
          <input
            className="width-clamp text-center button-shadow text-effect"
            type="text"
            name="end"
            id="end"
            value=""
            placeholder="end date"
            title="input: dd/mm/yyyy, also accepts: dd/mm/yy"
          />
        </div>

        <input
          className="py-1 padding-x-clamp button-shadow text-effect"
          type="text"
          name="job"
          id="job"
          value=""
          placeholder="Job"
        />
        <div className="grow-wrap">
          <textarea
            className="authority_body-input has-value button-shadow"
            name="text"
            id="text"
            value="Lorem ipsum, dolor sit amet consectetur adipisicing elit."
            placeholder="Annotations..."
          ></textarea>
        </div>
      </form>
    );
  };

  const Month = ({ events }: { events: Array<eventType> }) => {
    return (
      /* Month container: header | board */
      <div className="bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 shadow-[10px_10px_15px_rgba(0,0,0,0.3)] rounded-md flex flex-col justify-center">
        {/*month-header*/}
        <div className="bg-gray-300 rounded-md font-medium px-[2ch] border-b-4 border-gray-400 flex justify-center">
          February 2022
        </div>
        {/*board container*/}
        <div className="grid grid-cols-7 overflow-hidden relative last:bg-gray-300 border-b-4 border-b-gray-200 border-x-4">
          <DayStart weekday={"wed"} />
          {days.map((day) => (
            <Day key={day.toString()} day={day} events={events} />
          ))}
        </div>
      </div>
    );
  };

  const [toogleCreate, setToogleCreate] = useState(false);

  let stateToggle = "";
  let controllerToggle = "";
  if (toogleCreate) {
    stateToggle = "utility-smooth-display-on";
    controllerToggle = "components-controller-on";
  } else {
    stateToggle = "utility-smooth-display-off";
    controllerToggle = "components-controller-off";
  }

  return (
    <>
      {/*App*/}
      <div className="select-none box-border font-roboto font-extra 2xl:text-2xl xl:text-xl md:text-base sm:text-xs text-xs custombp:text-xs">
        {/*header-layout*/}
        <div
          className="sticky z-TopLayer top-0 bg-gradient-to-r from-gray-400 via-gray-100 to-gray-100"
          onClick={() => setToogleCreate((prev) => !prev)}
        >
          {/*header*/}
          <div className="flex justify-between items-center font-extra">
            {/*left-header*/}
            <div className="sm:ml-28 ml-2 overflow-visible whitespace-nowrap portrait:mr-2 ">
              JH Diary
            </div>
            {/*center-header*/}{" "}
            <div className="overflow-hidden whitespace-nowrap text-ellipsis portrait:mr-2">
              Friday, 21 January 2022
            </div>
            {/*right-header*/}
            <div className="">
              <div
                className="border-2 hover:bg-transparent mr-4 border-gray-200 hover:border-gray-700 hover:text-black rounded-full px-4 bg-gray-200 text-gray-700 transition-colors active:bg-indigo-500 "
                title={"Cleans up your session token | Ctrl+Alt+q"}
                onClick={(evt) => {
                  evt.stopPropagation();
                }}
              >
                Logout
              </div>
            </div>
          </div>
        </div>

        {/*main-layout: layout-grid*/}
        <div
          className={`sm:grid sm:landscape:grid flex flex-col ${controllerToggle} custombp:text-landscape`}
        >
          {/*controller-layout*/}
          <div
            className={`rounded-b-lg z-TopLayer mt-1
						bg-gradient-to-b from-gray-100 via-gray-300 to-gray-400	
						 ${stateToggle} utility-smooth sticky top-8  custombp:top-5 `}
          >
            {/* this sticky could be removed */}
            <div className="sticky">{true && <CreateEvent />}</div>
          </div>

          {/*calendar-layout*/}
          <div className="m-0">
            {/*calendar*/}
            <div className="grid gap-4 mt-1 components-calendar sm:mx-4 mx-0 bg-white">
              <Month events={events1} />
              <Month events={events2} />
              <Month events={events2} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
