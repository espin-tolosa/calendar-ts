import { useContext } from "react";
import React, { MouseEventHandler } from "react";
import { Styles_Bodies_Event } from "@styles/Bodies/Events";
import { SimpleCtx } from "@context/formdata";

interface EventProps {
  job: string;
}

export const Event: React.FC<EventProps> = ({ job }): JSX.Element => {
  const myCtx = useContext(SimpleCtx);

  const [clientform, setClient] = [myCtx.client, myCtx.setClient];
  const [jobform, setJob] = [myCtx.job, myCtx.setJob];
  const hOnClick = () => {
    console.log("Event", job);
    console.log(clientform);
    setJob(job);
  };
  return (
    <Styles_Bodies_Event>
      {<div onClick={hOnClick}>{job}</div>}
    </Styles_Bodies_Event>
  );
};
