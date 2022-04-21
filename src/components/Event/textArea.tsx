import * as StyledEvent from "./tw";
import { event } from "@interfaces/index";

import { fetchEvent } from "@/utils/fetchEvent";
import { useState } from "react";

export type TextArea = {
  event: event;
};

export const EventTextArea = ({ event }: TextArea) => {
  const [state, setState] = useState(event.job);

  return (
    <StyledEvent.TWjobContent>
      <span
        className="textarea rounded-[5px] w-full p-1 caret-black"
        role="textbox"
        contentEditable={true}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            const job = e.currentTarget.textContent || "";
            fetchEvent("PUT", { ...event, job });
            setState(job);
            e.currentTarget.blur();
          } else if (e.code === "Escape") {
            e.currentTarget.blur();
          }
        }}
        onBlur={() => {
          console.log("Element finished");
          location.reload();
        }}
      >
        {state}
      </span>
    </StyledEvent.TWjobContent>
  );
};
