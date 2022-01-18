import { useEffect, useState, useRef } from "react";
import tw from "tailwind-styled-components";
import "@styles/codelink.css";

const events = [
  { id: 1, start: 1, job: "Starting 1" },
  { id: 2, start: 22, job: "Starting 2" },
  { id: 3, start: 22, job: "Starting 3" },
  { id: 4, start: 22, job: "Starting 4" },
  { id: 5, start: 22, job: "Starting 5" },
];
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
const Event_span = tw.div<{ cells: number }>`
	event

	${({ cells }) =>
    (cells === 1 && "event-span-1") ||
    (cells === 2 && "event-span-2") ||
    (cells === 3 && "event-span-3") ||
    (cells === 4 && "event-span-4") ||
    (cells === 5 && "event-span-5") ||
    (cells === 6 && "event-span-6") ||
    (cells === 7 && "event-span-7") ||
    "extend-event-1"}
`;
const Extend_event = tw.div<{ span: number }>`
	extend-event

	${({ span }) =>
    (span === 1 && "extend-event-1") ||
    (span === 2 && "extend-event-2") ||
    (span === 3 && "extend-event-3") ||
    (span === 4 && "extend-event-4") ||
    (span === 5 && "extend-event-5") ||
    (span === 6 && "extend-event-6") ||
    (span === 7 && "extend-event-7") ||
    "extend-event-1"}
`;

/*


  .extend-event-1 {
  }
  .extend-span-1 {
  }
*/

const Day = ({ day }: { day: number }) => {
  const tempDay = String(day);
  const dayPadd = day < 10 ? `0${tempDay}` : tempDay;
  /*
  const styles = {
    backgroundColor: "white"
  } as const;
style={styles} */

  return (
    <div
      className="day"
      onMouseUp={() => {
        console.log("leaving action at day:", dayPadd);
      }}
      onMouseEnter={() => console.log("passing over:", dayPadd)}
    >
      <div className="day-header">{dayPadd}</div>
      {events
        .filter((evt) => evt.start === day)
        .map((evt) => {
          const classNameTemplate = `event span-${evt.id}`;
          return (
            <>
              <div className="container">
                <Event_span
                  key={evt.id}
                  cells={evt.id}
                  onMouseDownCapture={() => {
                    console.log("Event:", evt.job);
                  }}
                >
                  {evt.job}
                </Event_span>
                <Extend_event
                  span={evt.id}
                  onMouseDownCapture={() => {
                    console.log("extend event:", evt.id);
                  }}
                  onMouseOut={() => {
                    console.log("leaving extend event");
                  }}
                >
                  {"_"}
                </Extend_event>
                <div key={"p" + evt.id} className="event-holder"></div>
              </div>
            </>
          );
        })}
    </div>
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
    controllerToggle = "controller-on";
  } else {
    stateToggle = "smooth-display-off";
    controllerToggle = "controller-off";
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
            {/*calendar*/}
            <div className="calendar">
              <Month />
              <Month />
              <Month />
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
