import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as StyledEvent from "./tw";

import { fetchEvent } from "../../utils/fetchEvent";
import { useEventDispatch } from "../../hooks/useEventsState";
import { useToken } from "../../hooks/useToken";

//Export to be composed in Event Card exposing props
export interface TextArea {
  event: jh.event;
  textArea: number;
  setTextArea: React.Dispatch<React.SetStateAction<number>>;
  setTextEvent: React.Dispatch<React.SetStateAction<number>>;
  refNode: React.RefObject<HTMLDivElement>;
}

//Adding props to communicate just between Event Card and TextArea
interface TextAreaLocal extends TextArea {
  isHover: boolean;
  setIsHover: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EventTextArea = ({
  event,
  textArea,
  setTextArea,
  setTextEvent,
  refNode,
  isHover,
  setIsHover,
}: TextAreaLocal) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const eventDispatcher = useEventDispatch();
  const [isHoverActive, setIsHoverActive] = useState(false);

  // Fetch job  changes before unmount the component
  //  useLayoutEffect(() => {
  //    return () => {
  //      if (textRef.current === null) {
  //        return;
  //      }
  //      const job = (textRef.current?.textContent ?? "").trim();
  //      if (job === event.job) {
  //        return;
  //      }
  //
  //      fetchEvent("PUT", { ...event, job });
  //      eventDispatcher({
  //        type: "update",
  //        payload: [{ ...event, job }],
  //      });
  //    };
  //  }, [event]);

  useEffect(() => {
    const result = refNode.current?.clientHeight ?? 0;
    if (result === 0) {
      return;
    }
    setTextEvent(event.id);
    setTextArea(result);
    return () => {
      setTextArea(0);
      setTextEvent(0);
    };
  }, [isHover, isHoverActive]);

  const user = useToken();
  if (user.isValid() && !user.isAuth()) {
    //TODO: unify span component into StyledEvent.TWjobDesciption
    if (event.job === "" || event.job == null) {
      return <StyledEvent.TWjobContent></StyledEvent.TWjobContent>;
    }
    return (
      <StyledEvent.TWjobContent>
        <StyledEvent.TWtextArea>{event.job}</StyledEvent.TWtextArea>
      </StyledEvent.TWjobContent>
    );
  }

  if (user.isAuth()) {
    if ((event.job === "" || event.job == null) && !isHoverActive && !isHover) {
      return <StyledEvent.TWjobContent></StyledEvent.TWjobContent>;
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
            setIsHoverActive(true);
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
            setIsHover(false);
            setIsHoverActive(false);
          }}
        >
          {event.job}
        </StyledEvent.TWtextArea>
      </StyledEvent.TWjobContent>
    );
  }

  return <></>;
};
