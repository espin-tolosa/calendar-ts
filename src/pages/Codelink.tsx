import { useEffect, useState, useRef } from "react";
import tw from "tailwind-styled-components";
import "@styles/codelink.css";

import { TW_header, TW_container } from "@/components/Day/tw";

const events1 = [
  { id: 1, start: 1, job: "Starting 1 - 1" },
  { id: 2, start: 2, job: "Starting 2 - 1" },
  { id: 3, start: 11, job: "Starting 3 - 1" },
  { id: 4, start: 20, job: "Starting 4 - 1" },
];
const events2 = [
  { id: 1, start: 6, job: "Starting 1 - 2" },
  { id: 2, start: 6, job: "Starting 2 - 2" },
  { id: 3, start: 6, job: "Starting 3 - 2" },
  { id: 4, start: 6, job: "Starting 4 - 2" },
  { id: 5, start: 6, job: "Starting 5 - 2" },
  { id: 6, start: 6, job: "Starting 6 - 2" },
  { id: 7, start: 6, job: "Starting 7 - 2" },

  { id: 7, start: 6, job: "Starting 7 - 2" },
  { id: 6, start: 6, job: "Starting 6 - 2" },
  { id: 5, start: 6, job: "Starting 5 - 2" },
  { id: 4, start: 6, job: "Starting 4 - 2" },
  { id: 3, start: 6, job: "Starting 3 - 2" },
  { id: 2, start: 6, job: "Starting 2 - 2" },
  { id: 1, start: 6, job: "Starting 1 - 2" },

  { id: 1, start: 22, job: "Starting 1 - 2" },
  { id: 2, start: 22, job: "Starting 2 - 2" },
  { id: 3, start: 22, job: "Starting 3 - 2" },
  { id: 4, start: 22, job: "Starting 4 - 2" },
  { id: 5, start: 22, job: "Starting 5 - 2" },
  { id: 6, start: 22, job: "Starting 6 - 2" },
  { id: 7, start: 22, job: "Starting 7 - 2" },

  { id: 7, start: 22, job: "Starting 7 - 2" },
  { id: 6, start: 22, job: "Starting 6 - 2" },
  { id: 5, start: 22, job: "Starting 5 - 2" },
  { id: 4, start: 22, job: "Starting 4 - 2" },
  { id: 3, start: 22, job: "Starting 3 - 2" },
  { id: 2, start: 22, job: "Starting 2 - 2" },
  { id: 1, start: 22, job: "Starting 1 - 2" },
];

const events = [events1, events2];
//const events = [];

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

/* Attemp to use Styled Components with Tailwind */
/*
  background: transparent;
  color: transparent;
  padding: 0.1em 1ch 0.1em 1ch;
  position: absolute;
  z-index: 2;
  cursor: copy;
	margin-left: calc(2 * 50% / 7);
	min-width: calc(2 * 100% / 7 - 1 * 50% / 7);	
*/

const TW_Event_FlexContainer = tw.div`
  flex
  flex-column
	w-fit
	bg-[rgb(0,0,0,0.2)]
	`;

const TW_Event = tw.div<{ $cells: number; $hoverColor: number }>`	
	absolute
	bg-red-500
	whitespace-nowrap
	overflow-hidden
	overflow-ellipsis
	pl-2
	text-white
	rounded-full
	ml-[0.1rem]

	z-[1]

	text-sm
	
	hover:bg-red-800
	hover:cursor-pointer
	
	${({ $hoverColor }) => ($hoverColor === 0 && "bg-red-500") || "bg-red-800"}

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

/*
    background: transparent;
    color: transparent;
    position: absolute;
    z-index: 2;
    cursor: copy;
    font-size: 0.8rem;
    min-width: calc(50% / 7);

*/
// min-w-[7.14%] = 50%/7

const TW_Event_Extend = tw.div<{ $cells: number }>`
	absolute
	text-transparent
	z-[2]
	cursor-copy
	text-sm
	min-w-[7.14%]



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

const Day = ({ day }: { day: number }) => {
  const tempDay = String(day);
  const dayPadd = day < 10 ? `0${tempDay}` : tempDay;
  const [hoverExtendEvent, setHoverExtendEvent] = useState(0);
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

  return (
    <TW_container
      onMouseUp={() => {
        console.log("leaving action at day:", dayPadd);
      }}
      onMouseEnter={() => console.log("passing over:", dayPadd)}
    >
      {/*

  display: flex;
  justify-content: right;
  background: hsl(0, 0%, 99%);
				*/}

      <TW_header>{dayPadd}</TW_header>
      {events[1]
        .filter((evt) => evt.start === day)
        .map((evt) => {
          return (
            <>
              <TW_Event_FlexContainer>
                <TW_Event
                  key={evt.id}
                  $cells={evt.id}
                  $hoverColor={hoverExtendEvent}
                  onMouseDownCapture={() => {
                    console.log("Event:", evt.job);
                  }}
                >
                  {evt.job}
                </TW_Event>
                <TW_Event_Extend
                  $cells={evt.id}
                  onMouseDownCapture={() => {
                    console.log("extend event:", evt.id);
                  }}
                  onMouseEnter={() => {
                    setHoverExtendEvent(1);
                  }}
                  onMouseOut={() => {
                    console.log("leaving extend event");
                    setHoverExtendEvent(0);
                  }}
                >
                  {">"}
                </TW_Event_Extend>
                <div key={"p" + evt.id} className="event-holder"></div>
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

  return <div className="day-spot">{dayPadd}</div>;
};

export default function App(): JSX.Element {
  const days = Array.from(Array(30).keys()).map((day) => day + 1);

  const [height, setHeight] = useState(0);
  const ref = useRef(null);
  /*
  useEffect(() => {
    setHeight(ref.current.clientHeight);
    console.log(height)
  })
*/
  /*
        <DayStart weekday={"wed"}/>
        {
          days.map(day => <DaySpot key={day.toString()} day={day}/>)
        }
        </div>

 Calendar
       <div ref={ref} className="board">
        <div className="month">
          <DayStart weekday={"mon"}/>
          {
            days.map(day => <Day key={day.toString()} day={day}/>)
          }
        </div>
      
        <div className="month">
          <DayStart weekday={"wed"}/>
          {
            days.map(day => <Day key={day.toString()} day={day}/>)
          }
        </div>

      </div>



      */

  const Header = () => {
    return (
      <div className="header-layout sticky">
        <div className="flex sticky">
          <div className="header">
            <div className="left-header">JH Diary</div>
            <div className="center-header hidden">
              Today: 10 of January of 2022
            </div>
            <div className="right-header">Logout</div>
          </div>
        </div>
      </div>
    );
  };

  const CreateEvent = () => {
    return (
      <form className="create-event flex flex-column" action="post">
        <input className="create-event-button" type="submit" value="Create" />

        <div className="from-to-dates">
          <input
            className="create-event-text"
            type="text"
            name="start"
            id="start"
            value="31/01/2022"
            placeholder="start"
          />
          <input
            className="create-event-text"
            type="text"
            name="end"
            id="end"
            value=""
            placeholder="end"
          />
        </div>

        <input
          className="create-event-text"
          type="text"
          name="job"
          id="job"
          value="New job with a long title more long"
          placeholder="Job"
        />
        <div className="grow-wrap">
          <textarea
            className="authority_body-input has-value"
            name="text"
            id="text"
            value="Lorem ipsum, dolor sit amet consectetur adipisicing elit."
            placeholder="Annotations..."
          ></textarea>
        </div>
      </form>
    );
  };

  const Month = () => {
    return (
      <div className="month">
        <DayStart weekday={"wed"} />
        {days.map((day) => (
          <Day key={day.toString()} day={day} />
        ))}
      </div>
    );
  };

  const [toogleCreate, setToogleCreate] = useState(false);

  let stateToggle = "";
  let controllerToggle = "";
  if (toogleCreate) {
    stateToggle = "smooth-display-on";
    controllerToggle = "components-controller-on";
  } else {
    stateToggle = "smooth-display-off";
    controllerToggle = "components-controller-off";
  }
  const controllerLayoutClassName = `rounded-b-lg [z-index:11] border-x-2 border-x-gray-600 bg-gray-400 border-t-2 border-t-gray-200 ${stateToggle} smooth sticky top-controller`;

  return (
    <>
      {/*
				<div className="header-layout sticky flex" 
				onClick={() => setToogleCreate((prev) => !prev)}
				>
					<div className="header">
						<div className="left-header">JH Diary</div>
						<div className="center-header hidden">Today: 10 of January of 2022</div>
						<div className="right-header">Logout</div>
					</div>
				</div>
			*/}
      {/*App*/}
      <div className="select-none box-border">
        {/*header-layout*/}
        <div
          className="sticky z-10 top-0 bg-gradient-to-r from-gray-400 via-gray-100 to-gray-100"
          onClick={() => setToogleCreate((prev) => !prev)}
        >
          {/*header*/}
          <div className="flex h-8 justify-between">
            {/*left-header*/}
            <div className="flex items-center">JH Diary</div>
            {/*center-header*/}{" "}
            <div className="flex items-center">10 of January of 2022</div>
            {/*right-header*/}
            <div className="flex items-center">Logout</div>
          </div>
        </div>

        {/*main-layout*/}
        <div
          className={`2xl:grid landscape:grid sm:flex sm:flex-col gap-2 ${controllerToggle}`}
        >
          {/*controller-layout*/}
          <div
            className={`rounded-b-lg z-10 2xl:mt-4 sm:mt-0
						bg-gradient-to-b from-gray-100 via-gray-300 to-gray-400	
						 ${stateToggle} smooth sticky top-controller`}
          >
            {/* this sticky could be removed */}
            <div className="sticky">{true && <CreateEvent />}</div>
          </div>

          {/*calendar-layout*/}
          <div className="m-0">
            {/*calendar
						
  .calendar {
    margin-top: 1em;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--calendar_width), 1fr));
    margin-inline: 1em;
  }
						
						*/}
            <div className="grid mt-4 components-calendar mx-0 sm:mx-4 bg-gray-200">
              <Month />
            </div>
          </div>
        </div>
      </div>
      {/* 
					
	
	<div className={`main-layout ${controllerToggle}`}>
	<div className={controllerLayoutClassName}>
	<div className="controller sticky top-controller">
	{true && <CreateEvent />}
	</div>
	</div>
	
	<div className="calendar-layout">
	{true && (
		<div className="calendar">
		<Month />
		</div>
		)}
		</div>
		</div>
		
	*/}
    </>
  );
}
