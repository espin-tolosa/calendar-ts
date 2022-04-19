import * as StyledEvent from "./tw";
import { event } from "@interfaces/index";

import { fetchEvent } from "@/utils/fetchEvent";
import { useState } from "react";
//import { usePostQuery } from "@/api/queries";

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
          }
        }}
      >
        {state}
      </span>
    </StyledEvent.TWjobContent>
  );
};
