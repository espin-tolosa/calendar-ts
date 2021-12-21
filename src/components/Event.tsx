import { useContext } from "react";
import React, { MouseEventHandler } from "react";
import { Styles_Bodies_Event } from "@styles/Bodies/Events";
import { SimpleCtx, SetDatesCtx } from "@context/formdata";

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
