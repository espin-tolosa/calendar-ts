import { eventID } from "./main";
import * as StyledEvent from "./tw";
import { TextArea, EventTextArea, EventTextAreaDemo } from "./textArea";
import { ClientSelector, EventClientSelector } from "./clientSelector";
import { useRef, useState } from "react";

type EventCard = TextArea & ClientSelector;

export const EventCard: React.FC<EventCard> = (propTypes): JSX.Element => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      id={eventID(propTypes.event.id, "master", "ContentContainer")}
      className="flex flex-col w-full"
      ref={nodeRef}
     // onMouseEnter={() => setIsHover(true)}
     // onMouseLeave={() => setTimeout(() => setIsHover(false), 1000)}
    >
      <EventClientSelector style={propTypes.style} event={propTypes.event} />

      <EventTextArea
        event={propTypes.event}
        textArea={propTypes.textArea}
        setTextArea={propTypes.setTextArea}
        setTextEvent={propTypes.setTextEvent}
        refNode={nodeRef}
        isHover={isHover}
        setIsHover={setIsHover}
      />
    </div>
  );
};

export const EventTail = ({ event }: { event: jh.event }) => {
  return <div className="h-4">{event.client}</div>;
};

export const EventCardDemo: React.FC<EventCard> = (propTypes): JSX.Element => {
  return (
    <div
      id={eventID(propTypes.event.id, "master", "ContentContainer")}
      className="flex flex-col w-full"
    >
      <StyledEvent.TWStyledNonSelect style={propTypes.style}>
        {propTypes.event.client}
      </StyledEvent.TWStyledNonSelect>

      <EventTextAreaDemo event={propTypes.event} />
    </div>
  );
};
//<EventClientSelector style={propTypes.style} event={propTypes.event} />
