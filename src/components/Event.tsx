import React, { MouseEventHandler } from "react";
import { Styles_Bodies_Event } from "@styles/Bodies/Events";

interface EventProps {
  job: string;
}

export const Event: React.FC<EventProps> = ({ job }): JSX.Element => {
  const hOnClick = () => {
    console.log("Event", job);
  };
  return (
    <Styles_Bodies_Event>
      {<div onClick={hOnClick}>{job}</div>}
    </Styles_Bodies_Event>
  );
};
