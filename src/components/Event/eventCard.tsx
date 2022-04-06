import { EventTextArea } from "./textArea";
import { ClientSelector, EventClientSelector } from "./clientSelector";
import { TextArea } from "./textArea";
import { event } from "@/interfaces";

type EventCard = TextArea & ClientSelector;

export const EventCard = ({ event, isHover, style }: EventCard) => {
  return (
    <div className="flex flex-col w-full">
      <EventClientSelector event={event} style={style} />

      <EventTextArea event={event} isHover={isHover} />
    </div>
  );
};

export const EventTail = ({ event }: { event: event }) => {
  return <div className="text-transparent">{event.client}</div>;
};
