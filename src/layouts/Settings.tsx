import { EventCardDemo } from "@/components/Event/eventCard";
import { useHoverEvent, useStyles } from "@/components/Event/logic";
import { useClientsStyles } from "@/context/useFetchClientStyle";
import { nullEvent } from "@/interfaces";
import { createRef, useState } from "react";
import { Color, SliderPicker } from "react-color";

export function Settings() {
  const clients = useClientsStyles();

  return (
    <ul className="my-30 py-16 grid grid grid-cols-3 gap-16 ">
      {clients.success &&
        clients.response.clients.map((name) => {
          return <Line key={name} name={name} />;
        })}
    </ul>
  );
}

function Line({ name }: { name: string }) {
  const event: jh.event = {
    ...nullEvent(),
    client: name,
    job: "Job description demo",
  };
  return <EventDemo event={event}></EventDemo>;
}

const EventDemo = ({ event }: { event: jh.event }) => {
  const { hover } = useHoverEvent(event);
  //TODO: make this a function
  const clientsStyles = useClientsStyles();
  const color = clientsStyles.response?.colors[event.client] || {
    primary: "#abcabc",
    secondary: "#aaaaaa",
  };

  const [colorPicker, setColorPicker] = useState<Color>(color.primary);

  const style = useStyles(false, hover, event, colorPicker as string);

  return (
    <>
      <div className="flex justify-around text-xs ">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl" style={style?.dinamic}>
            <EventCardDemo
              event={event}
              refNode={createRef()}
              style={style?.static || {}}
              textArea={0}
              setTextArea={() => 0}
              setTextEvent={() => 0}
            />
          </div>
          <div className="flex w-40 flex-col">
            <div className="hue-horizontal h-4 hidden"></div>
            <SliderPicker
              color={colorPicker}
              onChangeComplete={(color) => {
                setColorPicker(color.hex);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
