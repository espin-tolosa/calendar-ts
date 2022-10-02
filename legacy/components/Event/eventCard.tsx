import * as StyledEvent from "./tw";
import { TextArea, EventTextArea, EventTextAreaDemo } from "./textArea";
import { ClientSelector, EventClientSelector } from "./clientSelector";
import { useRef, useState } from "react";
import { EventClass } from "@/classes/event";

type EventCard = TextArea & ClientSelector;

export const EventCard = ({event, style}:EventCard) =>
{
    const nodeRef = useRef<HTMLDivElement>(null);
    const [isHover, setIsHover] = useState(false);

    return (
        <div    id={EventClass.eventID(event.id, "master", "ContentContainer")}
                className="flex flex-col w-full"
                ref={nodeRef}
                title={`${event.client}: ${event.job} from: ${event.start} to ${event.start}`}
                // onMouseEnter={() => setIsHover(true)}
                // onMouseLeave={() => setTimeout(() => setIsHover(false), 1000)}
        >
            <EventClientSelector style={style} event={event} />
            <EventTextArea event={event} refNode={nodeRef} isHover={isHover} setIsHover={setIsHover}/>
        </div>
    );
};

export const EventCardDemo: React.FC<EventCard> = (propTypes): JSX.Element =>
{
    return (
        <div id={EventClass.eventID(propTypes.event.id, "master", "ContentContainer")} className="flex flex-col w-full">
            <StyledEvent.TWStyledNonSelect style={propTypes.style}>
                {propTypes.event.client}
            </StyledEvent.TWStyledNonSelect>
            <EventTextAreaDemo event={propTypes.event} />
        </div>
    );
};
//<EventClientSelector style={propTypes.style} event={propTypes.event} />
