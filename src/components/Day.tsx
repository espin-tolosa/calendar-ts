import { useContext } from "react";
import { ReactChildren, ReactChild } from "react";
import React, { MouseEventHandler } from "react";
import { Styles_Bodies_Day } from "@styles/Bodies/Day";
import { SimpleCtx } from "@context/formdata";

interface DayProps {
  children: ReactChild | ReactChildren;
  date: string;
}

export const Day: React.FC<DayProps> = ({ date, children }): JSX.Element => {
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
