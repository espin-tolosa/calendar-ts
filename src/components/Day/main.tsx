import { FC, useContext, useState, ReactChild, ReactChildren } from "react";
import { SimpleCtx } from "@context/formdata";
import { TW_header, Styles_Bodies_Day } from "@/components/Day/tw";

interface DayProps {
  children: ReactChild | ReactChildren;
  date: string;
}

export const Day: FC<DayProps> = ({ date, children }): JSX.Element => {
  const myCtx = useContext(SimpleCtx);

  const [clientform, setClient] = [myCtx.client, myCtx.setClient];
  const [jobform, setJob] = [myCtx.job, myCtx.setJob];
  const hOnClick = () => {
    console.log("Event", date);
    console.log(clientform);
    setJob(date);
  };
  return <Styles_Bodies_Day date={date}>{children}</Styles_Bodies_Day>;
};

/*
const Day = ({ day }: { day: number }) => {
  const tempDay = String(day);
  const dayPadd = day < 10 ? `0${tempDay}` : tempDay;
  const [hoverExtendEvent, setHoverExtendEvent] = useState(0);
	
  const styles = {
    backgroundColor: "white"
  } as const;
style={styles} */
/*
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
    </div>
  );
};
*/
