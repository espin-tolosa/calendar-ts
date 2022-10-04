import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as StyledEvent from "./tw";

import { fetchEvent } from "../../utils/fetchEvent";
import { useEventDispatch } from "../../hooks/useEventsState";
//import { useToken } from "../../hooks/useToken";
import { textAreaCtx } from "../Month/components/CurrentDays";
import { useResizeEventLayoutObservingWindowSize } from "./hooks/useResizeEventLayoutObservingWindowSize";
import { useDispatchOnBlur } from "./hooks/useDispatchOnBlur";
import { DateService } from "../../utils/Date";

//Export to be composed in Event Card exposing props
export interface TextArea {
  event: jh.event;
  refNode: React.RefObject<HTMLDivElement>;
}

//Adding props to communicate just between Event Card and TextArea
interface TextAreaLocal extends TextArea {
  isHover: boolean;
  setIsHover: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EventTextArea ({event, refNode, isHover, setIsHover} : TextAreaLocal)
{
    
    const textRef = useRef<HTMLSpanElement>(null);
    const [isHoverActive, setIsHoverActive] = useState(false);
    const textArea = useContext(textAreaCtx) as jh.textArea;
    
    //! START COMMENT
    const eventDispatcher = useEventDispatch();
    useDispatchOnBlur(textRef, event, isHoverActive);
    //! END COMMENT

    useResizeEventLayoutObservingWindowSize(refNode, event);

    const SingleLineEvent = (event.job === "" || event.job == null) && !isHoverActive && !isHover;

    const eventLong = DateService.DaysFrom(event.start, event.end);

    return (
        <StyledEvent.TWjobContent $isHover={isHoverActive}>
        {
            SingleLineEvent ?
            <></> :
            <StyledEvent.TWtextArea ref={textRef} role="textbox" contentEditable={true} suppressContentEditableWarning={true}

                //! START COMMENT
                onClick={(e) =>
                {
                    setIsHoverActive(true);
                    e.currentTarget.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
                    e.currentTarget.focus();
                }}

                onFocus={() =>
                {
                    if (textRef.current)
                    {
                        const range = window.document.createRange();
                        range.selectNodeContents(textRef.current);
                        range.collapse(false);
                        window.getSelection()?.removeAllRanges();
                        window.getSelection()?.addRange(range);
                    }
                }}

                onKeyDown={(e) =>
                {
                    if (e.code === "Enter" || e.code === "Escape")
                    {
                        e.currentTarget.blur();
                    }
                }}

                onKeyUp={()=>{

                    textArea.setTextEvent(event.id);
                    textArea.setTextArea(refNode.current?.clientHeight ?? 0);
                }}

                onBlur={(e) =>
                {
                     const job = (e.currentTarget.textContent ?? "").trim().replaceAll("\n", " ");
                     fetchEvent("PUT", { ...event, job });
                     eventDispatcher({type: "update", payload: [{ ...event, job }]});
                     setIsHover(false);
                     setIsHoverActive(false);
                }}
                //! END COMMENT
            >
                {isHoverActive ? event.job : event.job.substring(0,15*(1+eventLong))}
            </StyledEvent.TWtextArea>
        }
        </StyledEvent.TWjobContent>
    );
}


export interface TextAreaDemo {
  event: jh.event;
}

export const EventTextAreaDemo = ({ event }: TextAreaDemo) =>
{
    return (
        <StyledEvent.TWjobContent $isHover={false}>
            <StyledEvent.TWtextArea role="textbox"> {event.job} </StyledEvent.TWtextArea>
        </StyledEvent.TWjobContent>
    );
};
