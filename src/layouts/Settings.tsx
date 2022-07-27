import { EventCard } from "@/components/Event/eventCard";
import { useHoverEvent, useStyles } from "@/components/Event/logic";
import { useClientsStyles } from "@/context/useFetchClientStyle";
import { nullEvent } from "@/interfaces";
import { createRef } from "react";

export function Settings() {
  const clients = useClientsStyles();

  return (
    <ul>
      {clients.success &&
        clients.response.clients.map((name) => {
          return <Line key={name} name={name} />;
        })}
    </ul>
  );
}

function Line({ name }: { name: string }) {
  const event: jh.event = { ...nullEvent(), client: name };
  return <EventDemo event={event}></EventDemo>;
}

const EventDemo = ({ event }: { event: jh.event }) => {
  const { hover } = useHoverEvent(event);

  // Style hook for state transitions
  const clientsStyles = useClientsStyles();

  //TODO: make this a function
  const color = clientsStyles.response?.colors[event.client] || {
    primary: "#abcabc",
    secondary: "#aaaaaa",
  };

  const style = useStyles(false, hover, event, color.primary);

  return (
    <div className="flex justify-around">
      <div className="w-40">
        <EventCard
          event={event}
          refNode={createRef()}
          style={style?.static || {}}
          textArea={0}
          setTextArea={() => 0}
          setTextEvent={() => 0}
        />
      </div>
      <div>
        <div>color:</div>
        <div>{color.primary}</div>
      </div>
      <div>
        <div>Details</div>
      </div>
    </div>
  );
};
