import { eventID } from "./main";
import { TextArea, EventTextArea } from "./textArea";
import { ClientSelector, EventClientSelector } from "./clientSelector";

type EventCard = TextArea & ClientSelector;

export const EventCard: React.FC<EventCard> = (propTypes): JSX.Element => {
  return (
    <div
      id={eventID(propTypes.event.id, "master", "ContentContainer")}
      className="flex flex-col w-full"
    >
      <EventClientSelector style={propTypes.style} event={propTypes.event} />

      <EventTextArea event={propTypes.event} />
    </div>
  );
};

export const EventTail = ({ event }: { event: jh.event }) => {
  return <div className="h-4">{event.client}</div>;
};
