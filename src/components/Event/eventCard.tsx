import { eventID } from "./main";
import { TextArea, EventTextArea } from "./textArea";
import { ClientSelector, EventClientSelector } from "./clientSelector";
import { useRef } from "react";

type EventCard = TextArea & ClientSelector;

export const EventCard: React.FC<EventCard> = (propTypes): JSX.Element => {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <div
      id={eventID(propTypes.event.id, "master", "ContentContainer")}
      className="flex flex-col w-full"
      ref={nodeRef}
    >
      <EventClientSelector style={propTypes.style} event={propTypes.event} />

      <EventTextArea
        event={propTypes.event}
        setTextArea={propTypes.setTextArea}
        setTextEvent={propTypes.setTextEvent}
        refNode={nodeRef}
      />
    </div>
  );
};

export const EventTail = ({ event }: { event: jh.event }) => {
  return <div className="h-4">{event.client}</div>;
};
