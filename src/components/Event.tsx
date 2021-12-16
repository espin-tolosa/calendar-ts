import React from "react";
import { Styles_Bodies_Event } from "../styles/Bodies/Events";

interface EventProps {
  job: string;
}

export const Event: React.FC<EventProps> = ({ job }): JSX.Element => {
  return (
    <Styles_Bodies_Event>
      {
        <div
          onClick={() => {
            console.log(`Event job: ${job}`);
          }}
        >
          {job}
        </div>
      }
    </Styles_Bodies_Event>
  );
};
