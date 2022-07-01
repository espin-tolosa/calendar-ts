import { EventTextArea } from "./textArea";
import { ClientSelector, EventClientSelector } from "./clientSelector";
import { TextArea } from "./textArea";
import { event } from "../../interfaces";

type EventCard = TextArea & ClientSelector;

export const EventCard: React.FC<EventCard> = (propTypes): JSX.Element => {
  return (
    <div className="flex flex-col w-full z-100">
      <EventClientSelector style={propTypes.style} event={propTypes.event} />

      <EventTextArea event={propTypes.event} />
    </div>
  );
};

export const EventTail = ({ event }: { event: event }) => {
  return <div className="text-transparent ">{event.client}</div>;
};
