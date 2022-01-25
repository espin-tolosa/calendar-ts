import * as tw_Event from "./tw";
import { useContext } from "react";
import React, { MouseEventHandler } from "react";
import { SetDatesCtx } from "@context/formdata";
import { giveMeColor } from "@/utils/giveMeColor";
import { event } from "@interfaces/index";

export const Event = (event: event) => {
  const { setStart, setEnd } = useContext(SetDatesCtx);

  const hOnClick = () => {
    setStart("2021-08-25" + event.job);
    setEnd("2021-09-18" + event.job);
  };
  return (
    <tw_Event.flexContainer>
      <tw_Event.textContent
        style={giveMeColor(event.client)}
        key={event.id}
        $cells={event.id}
        onMouseDownCapture={() => {
          console.log("Event:", event.job);
        }}
        onClick={hOnClick}
        title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
      >
        {`${event.client}: ${event.job}`}
      </tw_Event.textContent>
      <tw_Event.extend
        $cells={event.id}
        onMouseDownCapture={() => {
          console.log("extend event:", event.id);
        }}
        onMouseEnter={() => {
          console.log("enter extend event");
        }}
        onMouseOut={() => {
          console.log("leaving extend event");
        }}
        title={`Drag here to extend ${event.client}\'s job`}
      >
        {">"}
      </tw_Event.extend>
      <tw_Event.placeholder key={"p" + event.id}>{"-"}</tw_Event.placeholder>
    </tw_Event.flexContainer>
  );
};

//		<Styles_Bodies_Event>
//			{<div onClick={hOnClick}>{job}</div>}
//		</Styles_Bodies_Event>

//Fix: interface-childs-array
/*
interface AuxProps {
	children:
		| Array<ReactChild>
		| Array<ReactChildren>
		| ReactChild
		| ReactChildren;
}

export const Styles_Bodies_Event = ({ children }: AuxProps) => (
	<div className="text-sm select-none font-medium text-green-900 bg-sky-600 hover:bg-sky-700 px-8 my-2">
		{children}
	</div>
);

interface EventProps {
	job: string;
}

export const Event: React.FC<EventProps> = ({ job }): JSX.Element => {
	const { setStart, setEnd } = useContext(SetDatesCtx);

	const hOnClick = () => {
		setStart("2021-08-25" + job);
		setEnd("2021-09-18" + job);
	};
	return (
		<Styles_Bodies_Event>
			{<div onClick={hOnClick}>{job}</div>}
		</Styles_Bodies_Event>
	);
};
*/
