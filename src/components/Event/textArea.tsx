import * as StyledEvent from "./tw";
import { event } from "@interfaces/index";
import { useEventDispatch } from "@/hooks/useEventsState";
import { fetchEvent } from "@/utils/fetchEvent";
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";
import { useState } from "react";
//import { usePostQuery } from "@/api/queries";

export type TextArea = {
  event: event;
  isHover: boolean;
};

export const EventTextArea = ({ event, isHover }: TextArea) => {
  const eventDispatcher = useEventDispatch();
  const pushDaysDispatcher = usePushedDaysDispatcher();
  const [state, setState] = useState(event.job);

  return (
    <StyledEvent.TWjobContent $isHover={isHover}>
      <span
        className="textarea rounded-[5px] w-full p-1"
        role="textbox"
        contentEditable={true}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            const job = e.currentTarget.textContent || "";
            fetchEvent("PUT", { ...event, job });
            setState(job);
            /* An strategy to force update an entire week after commit new job description, but it doesn't work
						 the idea behind was to dispatch a ghost event in the same week that forces re-render them all
            eventDispatcher({
              type: "update",
              payload: [
                {
                  id: 0,
                  client: "",
                  job: "",
                  start: event.start,
                  end: event.end,
                },
              ],
              callback: pushDaysDispatcher,
            });
						*/
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.blur();
          }
        }}
      >
        {state}
      </span>
    </StyledEvent.TWjobContent>
  );
};
