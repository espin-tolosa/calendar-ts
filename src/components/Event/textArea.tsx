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
        onClick={(e) => {
          console.log("CLICK");
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
          //  window.alert(
          //    "key down: " +
          //      e.charCode +
          //      ", " +
          //      e.code +
          //      ", " +
          //      e.key +
          //      ", " +
          //      e.keyCode
          //  );
          if (e.code === "Enter") {
            const job = e.currentTarget.textContent || "";
            fetchEvent("PUT", { ...event, job });
            setState(job);
            e.currentTarget.blur();
          } else if (e.code === "Escape") {
            e.currentTarget.blur();
          }
        }}
        onBlur={(e) => {
          const job = e.currentTarget.textContent || "";
          console.log("Element finished", job);
          setState(job);
          fetchEvent("PUT", { ...event, job });
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
  console.log("CLICK");
  e.currentTarget.focus();
  //console.log("Click", e.currentTarget);
  eventDispatcher({
    type: "update",
    payload: [{ ...event, job: "" }],
    callback: pushDaysDispatcher,
  });
}}
onKeyDown={(e) => {
  console.log("KEYDOWN");
  //console.log(e.code);
  if (e.code === "Enter") {
    const job = e.currentTarget.textContent || "";
    console.log("Dispatching", job);
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
