import * as StyledEvent from "./tw";
import { event } from "@/interfaces/index";

import { fetchEvent } from "@/utils/fetchEvent";
import { useRef, useState } from "react";

export type TextArea = {
  event: event;
};

export const EventTextArea = ({ event }: TextArea) => {
  const [state, setState] = useState(event.job);
  const textRef = useRef<HTMLSpanElement>(null);

  return (
    <StyledEvent.TWjobContent>
      <span
        ref={textRef}
        className="textarea rounded-[5px] w-full p-1 caret-black"
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
          console.log(e.code);
          e.currentTarget.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
          //e.currentTarget.scroll({ top: 300, left: 100, behavior: "smooth" });
          if (e.code === "Enter" || e.code === "Escape") {
            e.currentTarget.blur();
          }
        }}
        onBlur={(e) => {
          const job = e.currentTarget.textContent || "";
          setState(job);
          fetchEvent("PUT", { ...event, job });
          e.currentTarget.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
          e.currentTarget.scrollTop();
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
