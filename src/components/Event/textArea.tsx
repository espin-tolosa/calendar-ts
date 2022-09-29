import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as StyledEvent from "./tw";

import { fetchEvent } from "../../utils/fetchEvent";
import { useEventDispatch } from "../../hooks/useEventsState";
import { useToken } from "../../hooks/useToken";
import { textAreaCtx } from "../Month/components/CurrentDays";

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

    /**
     * Ensure put event if component unmounts while editing it, case: unwanted scrolling during editing
     */

    //! START COMMENT
//    const eventDispatcher = useEventDispatch();
//
//    useEffect(() =>
//    {
//        return () =>
//        {
//            const job = (textRef.current?.textContent ?? "").trim();
//
//            if (!isHoverActive || job === "" || job === event.job)
//            {
//                return;
//            }
//
//            fetchEvent("PUT", { ...event, job });
//            eventDispatcher({type: "update", payload: [{ ...event, job }]});
//        };
//
//    }, [isHoverActive]);
    //! END COMMENT

    useLayoutEffect(() =>
    {
        if (refNode.current == null)
        {
            return;
        }

        const resizeObserver =  new ResizeObserver(() =>
        {
            if (refNode.current == null)
            {
                return;
            }
            textArea.setTextEvent(event.id);
            textArea.setTextArea(refNode.current.clientHeight);
        });

        resizeObserver.observe(refNode.current)

        return () =>
        {
            if (refNode.current == null)
            {
                return;
            }

            textArea.setTextArea(0);
            textArea.setTextEvent(0);
            resizeObserver.unobserve(refNode.current)
        };

    }, [refNode, refNode.current, event, isHover, textArea]);

    useLayoutEffect(() =>
    {
        const result = refNode.current?.clientHeight ?? 0;

        if (result === 0)
        {
            return;
        }

        textArea.setTextEvent(event.id);
        textArea.setTextArea(result);

        return () =>
        {
            textArea.setTextArea(0);
            textArea.setTextEvent(0);
        };

    }, [isHover, isHoverActive, textArea]);

    const user = useToken();
    if (user.isValid() && !user.isAuth())
    {
        //TODO: unify span component into StyledEvent.TWjobDesciption
        if (event.job === "" || event.job == null)
        {
            return <StyledEvent.TWjobContent></StyledEvent.TWjobContent>;
        }

        return (
            <StyledEvent.TWjobContent>
                <StyledEvent.TWtextArea>{event.job}</StyledEvent.TWtextArea>
            </StyledEvent.TWjobContent>
        );
    }

    if (user.isAuth())
    {
        if ((event.job === "" || event.job == null) && !isHoverActive && !isHover)
        {
            return <StyledEvent.TWjobContent></StyledEvent.TWjobContent>;
        }

        return (

            <StyledEvent.TWjobContent>
                <StyledEvent.TWtextArea ref={textRef} role="textbox" contentEditable={false} suppressContentEditableWarning={true}

                    //! START COMMENT
//                    onClick={(e) =>
//                    {
//                        e.currentTarget.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
//                        e.currentTarget.focus();
//                        setIsHoverActive(true);
//                    }}
//
//                    onFocus={() =>
//                    {
//                        if (textRef.current)
//                        {
//                            const range = window.document.createRange();
//                            range.selectNodeContents(textRef.current);
//                            range.collapse(false);
//                            window.getSelection()?.removeAllRanges();
//                            window.getSelection()?.addRange(range);
//                        }
//                    }}
//
//                    onKeyDown={(e) =>
//                    {
//                      if (e.code === "Enter" || e.code === "Escape")
//                    {
//                        e.currentTarget.blur();
//                    }
//                    }}
//
//                    onBlur={(e) =>
//                    {
//                         const job = (e.currentTarget.textContent ?? "").trim().replaceAll("\n", " ");
//                         fetchEvent("PUT", { ...event, job });
//                         eventDispatcher({type: "update", payload: [{ ...event, job }]});
//                         setIsHover(false);
//                         setIsHoverActive(false);
//                    }}
                    //! END COMMENT
                >
                    {event.job}
                </StyledEvent.TWtextArea>
            </StyledEvent.TWjobContent>
        );
    }
    return <></>;
}

export interface TextAreaDemo {
  event: jh.event;
}

export const EventTextAreaDemo = ({ event }: TextAreaDemo) =>
{
    return (
        <StyledEvent.TWjobContent>
            <StyledEvent.TWtextArea role="textbox"> {event.job} </StyledEvent.TWtextArea>
        </StyledEvent.TWjobContent>
    );
};
