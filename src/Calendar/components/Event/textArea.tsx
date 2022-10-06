import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as StyledEvent from "./tw";

import { fetchEvent } from "../../utils/fetchEvent";
import { useEventDispatch } from "../../hooks/useEventsState";
//import { useToken } from "../../hooks/useToken";
import { textAreaCtx } from "../Month/components/CurrentDays";
import { useResizeEventLayoutObservingWindowSize } from "./hooks/useResizeEventLayoutObservingWindowSize";
import { useDispatchOnBlur } from "./hooks/useDispatchOnBlur";
import { DateService } from "../../utils/Date";
import { useAuthLevel } from "@/Spa/context/authLevel";
import { FetchEvent } from "@/Calendar/classes/fetchEvent";

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
    const auth = useAuthLevel();
    
    //! START COMMENT
    const eventDispatcher = useEventDispatch();
    auth === "master" && useDispatchOnBlur(textRef, event);
    //! END COMMENT

    useResizeEventLayoutObservingWindowSize(refNode, event);

    const SingleLineEvent = (event.job === "" || event.job == null) && !isHoverActive && !isHover;

    const eventLong = DateService.DaysFrom(event.start, event.end);

    const isEscaped = useRef(false);

    return (
        <StyledEvent.TWjobContent $isHover={isHoverActive}>
        {
            SingleLineEvent ?
            <></> :
            <StyledEvent.TWtextArea ref={textRef} role="textbox" contentEditable={auth === "master"} suppressContentEditableWarning={true}
            $done={auth !== "client" && event.done}
            defaultValue={event.job}

                //! START COMMENT
                onClick={(e) =>
                {
                    if(auth !== "master")
                    {
                        return;
                    }
                    setIsHoverActive(true);
                    e.currentTarget.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
                    e.currentTarget.focus();
                }}

                onFocus={() =>
                {
                    if(auth !== "master")
                    {
                        return;
                    }
                    if (textRef.current)
                    {
                        const range = window.document.createRange();
                        range.selectNodeContents(textRef.current);
                        range.collapse(false);
                        window.getSelection()?.removeAllRanges();
                        window.getSelection()?.addRange(range);
                    }
                    isEscaped.current = false; //init a new cicle
                }}

                onKeyDown={(e) =>
                {
                    if(auth !== "master")
                    {
                        return;
                    }
                    if (e.code === "Enter")
                    {
                        e.currentTarget.blur();
                    }
                    if (e.code === "Escape")
                    {
                        isEscaped.current = true;
                        e.currentTarget.blur();
                    }
                }}

                onKeyUp={()=>{
                    if(auth !== "master")
                    {
                        return;
                    }

                    textArea.setTextEvent(event.id);
                    textArea.setTextArea(refNode.current?.clientHeight ?? 0);
                }}

                onBlur={(e) =>
                {
                    if(auth !== "master")
                    {
                        return;
                    }

                    /**
                     * Is Escape was pressed: recover the value and push it to text box using innterText prop,
                     * and don't do nothing more, such as push a new state or fetch a put query
                     */
                    if(isEscaped.current)
                    {
                        if(textRef.current !== null)
                        {
                            textRef.current.innerText = event.job;
                            isEscaped.current = false;
                            return;
                        }

                    }
                    
                    const job = (e.currentTarget.textContent ?? "").trim().replaceAll("\n", " ");
                    const putEvent = {...event, job};
                    eventDispatcher({type: "update", payload: [putEvent]});
                    setIsHover(false);
                    setIsHoverActive(false); 
                    const Event = new FetchEvent();
                    Event.update(putEvent)
                }}
                //! END COMMENT
            >
                {isHoverActive ? event.job : event.job.substring(0,50*(1+eventLong)) + (event.job.length > 50 ? "..." : "") }
                {/*isHoverActive ? event.job : event.job.substring(0,4*(1+eventLong)) + (event.job.length > 5 ? "..." : "") */}
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
            <StyledEvent.TWtextArea $done={false} role="textbox"> {event.job} </StyledEvent.TWtextArea>
        </StyledEvent.TWjobContent>
    );
};
