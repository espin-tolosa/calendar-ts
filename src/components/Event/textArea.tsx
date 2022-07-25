import React, { useLayoutEffect, useRef } from "react";
import * as StyledEvent from "./tw";

import { fetchEvent } from "../../utils/fetchEvent";
import { useEventDispatch } from "../../hooks/useEventsState";
import { useToken } from "../../hooks/useToken";

export type TextArea = {
  event: jh.event;
  textArea: number;
  setTextArea: React.Dispatch<React.SetStateAction<number>>;
  setTextEvent: React.Dispatch<React.SetStateAction<number>>;
  refNode: React.RefObject<HTMLDivElement>;
};

export const EventTextArea = ({
  event,
  textArea,
  setTextArea,
  setTextEvent,
  refNode,
}: TextArea) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const eventDispatcher = useEventDispatch();

  // Fetch job  changes before unmount the component
  useLayoutEffect(() => {
    return () => {
      const job = (textRef.current?.textContent ?? "").trim();
      if (job === event.job) {
        return;
      }

      fetchEvent("PUT", { ...event, job });
      eventDispatcher({
        type: "update",
        payload: [{ ...event, job }],
      });
    };
  }, [event]);

  const user = useToken();
  if (event.job === "") {
    return <></>;
  }
  if (!user.isAuth()) {
    //TODO: unify span component into StyledEvent.TWjobDesciption
    return (
      <StyledEvent.TWjobContent>
        <StyledEvent.TWtextArea>{event.job}</StyledEvent.TWtextArea>
      </StyledEvent.TWjobContent>
    );
  }

  return (
    <StyledEvent.TWjobContent>
      <StyledEvent.TWtextArea
        ref={textRef}
        role="textbox"
        contentEditable={true}
        //TODO: read this to gain control over the component: https://goshacmd.com/controlled-vs-uncontrolled-inputs-react/
        suppressContentEditableWarning={true}
        onClick={(e) => {
          e.currentTarget.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
          e.currentTarget.focus();
        }}
        onFocus={() => {
          if (textRef.current) {
            const range = window.document.createRange();
            range.selectNodeContents(textRef.current);
            range.collapse(false);
            window.getSelection()?.removeAllRanges();
            window.getSelection()?.addRange(range);
          }
        }}
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.code === "Escape") {
            e.currentTarget.blur();
          }
        }}
        onKeyUp={() => {
          const result = refNode.current?.clientHeight ?? 0;
          if (result !== textArea) {
            setTextEvent(event.id);
            setTextArea(result);
          }
        }}
        onBlur={(e) => {
          const job = (e.currentTarget.textContent ?? "")
            .trim()
            .replaceAll("\n", " ");
          if (job.includes("\n")) {
            console.warn("Unaccepted");
          }
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
      </StyledEvent.TWtextArea>
    </StyledEvent.TWjobContent>
  );
};
