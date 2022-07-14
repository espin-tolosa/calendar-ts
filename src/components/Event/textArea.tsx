import { useRef } from "react";
import * as StyledEvent from "./tw";

import { fetchEvent } from "../../utils/fetchEvent";
import { useEventDispatch } from "../../hooks/useEventsState";
import { usePushedDaysDispatcher } from "../../hooks/usePushDays";
import { useToken } from "@/hooks/useToken";

export type TextArea = {
  event: jh.event;
};

export const EventTextArea = ({ event }: TextArea) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const eventDispatcher = useEventDispatch();
  const pushDaysDispatcher = usePushedDaysDispatcher();

  //console.log(event.job);

  const user = useToken();
  if (event.job === "") {
    return <></>;
  }
  if (!user.isAuth()) {
    //TODO: unify span component into StyledEvent.TWjobDesciption
    return (
      <StyledEvent.TWjobContent>
        <span className="textarea rounded-[5px] w-full p-1 caret-black focus:bg-green-200 print:text-xs text-sm">
          {event.job}
        </span>
      </StyledEvent.TWjobContent>
    );
  }

  return (
    <StyledEvent.TWjobContent>
      <span
        ref={textRef}
        className="textarea rounded-[5px] w-full p-1 caret-black focus:bg-green-200 print:text-xs text-sm"
        role="textbox"
        contentEditable={true}
        //TODO: read this to gain control over the component: https://goshacmd.com/controlled-vs-uncontrolled-inputs-react/
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
          fetchEvent("PUT", { ...event, job });
          eventDispatcher({
            type: "update",
            payload: [{ ...event }],
            callback: pushDaysDispatcher,
          });
          //window.location.reload();
        }}
      >
        {event.job}
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
