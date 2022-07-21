import { useRef } from "react";
import * as StyledEvent from "./tw";

import { fetchEvent } from "../../utils/fetchEvent";
import { useEventDispatch } from "../../hooks/useEventsState";
import { useToken } from "@/hooks/useToken";

export type TextArea = {
  event: jh.event;
  setTextArea: React.Dispatch<React.SetStateAction<number>>;
  setTextEvent: React.Dispatch<React.SetStateAction<number>>;
  refNode: React.RefObject<HTMLDivElement>;
};

export const EventTextArea = ({
  event,
  setTextArea,
  setTextEvent,
  refNode,
}: TextArea) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const eventDispatcher = useEventDispatch();

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

          const result =
            refNode.current?.clientHeight || textRef.current?.clientHeight || 0;

          //debugger;
          console.log("Typing", event.id, result);
          setTextEvent(event.id);
          setTextArea(result);

          if (typeof event.mutable === "object") {
            event.mutable.height = "1500px";
          }
        }}
        onBlur={(e) => {
          const job = e.currentTarget.textContent || "";
          fetchEvent("PUT", { ...event, job });
          eventDispatcher({
            type: "update",
            payload: [{ ...event, job }],
          });

          setTextArea(0);
          setTextEvent(0);
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
  });
}}
onKeyDown={(e) => {
  if (e.code === "Enter") {
    const job = e.currentTarget.textContent || "";
    fetchEvent("PUT", { ...event, job });
    eventDispatcher({
      type: "update",
      payload: [{ ...event, job }],
    });
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.blur();
  }
}}

*/
