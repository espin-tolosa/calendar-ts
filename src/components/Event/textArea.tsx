import * as StyledEvent from "./tw";
import { event } from "@/interfaces/index";

import { fetchEvent } from "@/utils/fetchEvent";
import { useRef, useState } from "react";
import { useEventDispatch } from "@/hooks/useEventsState";
import { usePushedDaysDispatcher } from "@/hooks/usePushDays";

export type TextArea = {
  event: event;
};

export const EventTextArea = ({ event }: TextArea) => {
  const [state, setState] = useState(event.job);
  const textRef = useRef<HTMLSpanElement>(null);
  const eventDispatcher = useEventDispatch();
  const pushDaysDispatcher = usePushedDaysDispatcher();

  return (
    <StyledEvent.TWjobContent>
      <span
        ref={textRef}
        className="textarea rounded-[5px] w-full p-1 caret-black focus:bg-red-200"
        role="textbox"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onClick={(e) => {
          e.currentTarget.focus();
          if (textRef.current) {
            const range = window.document.createRange();
            range.selectNodeContents(textRef.current);
            range.collapse(false);
            window.getSelection()?.removeAllRanges();
            window.getSelection()?.addRange(range);
          }
        }}
        onKeyDown={(e) => {
          e.currentTarget.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
          if (e.code === "Enter" || e.code === "Escape") {
            e.currentTarget.blur();
          }
          setTimeout(() => {
            eventDispatcher({
              type: "update",
              payload: [{ ...event }],
              callback: pushDaysDispatcher,
            });
          }, 1);
        }}
        onBlur={(e) => {
          const job = e.currentTarget.textContent || "";
          setState(job);
          fetchEvent("PUT", { ...event, job });
          eventDispatcher({
            type: "update",
            payload: [{ ...event }],
            callback: pushDaysDispatcher,
          });
          //window.location.reload();
        }}
      >
        {state}
      </span>
    </StyledEvent.TWjobContent>
  );
};

/*
onClick={(e) => {
  e.currentTarget.focus();
  eventDispatcher({
    type: "update",
    payload: [{ ...event, job: "" }],
    callback: pushDaysDispatcher,
  });
}}
onKeyDown={(e) => {
  if (e.code === "Enter") {
    const job = e.currentTarget.textContent || "";
    fetchEvent("PUT", { ...event, job });
    eventDispatcher({
      type: "update",
      payload: [{ ...event, job }],
      callback: pushDaysDispatcher,
    });
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.blur();
  }
}}

*/
