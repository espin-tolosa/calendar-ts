import { ReactChildren, ReactChild } from "react";
import { useContext, useState } from "react";

import { SimpleCtx, DatesCtx, SetDatesCtx } from "@context/formdata";
import { EventsCtx } from "@context/eventsarray";

//Fix: interface-childs-array

interface EventProps {
  name: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

interface AuxProps {
  hidden: string;
  children:
    | Array<ReactChild>
    | Array<ReactChildren>
    | ReactChild
    | ReactChildren;
}

export const EventForm = ({ hidden, children }: AuxProps) => (
  <div
    className={`sticky select-none ${hidden} transition-hidden  inset-x-0 top-0 left-0 bg-gray-400 py-5`}
    onClick={(event) => {
      event.stopPropagation();
      console.log("Close the menu");
    }}
  >
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      {children}
    </form>
  </div>
);

export const Board = () => {
  const myCtx = useContext(SimpleCtx);
  const { events, dispatch } = useContext(EventsCtx);
  const { start, end } = useContext(DatesCtx);
  const { setStart, setEnd } = useContext(SetDatesCtx);

  const [client, setClient] = [myCtx.client, myCtx.setClient];
  const [job, setJob] = [myCtx.job, myCtx.setJob];
  //  const [start, setStart] = useState("");
  //  const [end, setEnd] = useState("");
  const [hidden, setHidden] = useState("");
  return (
    <>
      <button
        className="bg-blue-500 select-none hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={(event) => {
          event.stopPropagation();
          hidden === "hidden" ? setHidden("") : setHidden("hidden");
        }}
      >
        Display Board
      </button>
      <EventForm hidden={hidden}>
        <TextForm name="client" value={client} setValue={setClient} />
        <TextForm name="job" value={job} setValue={setJob} />
        <TextForm name="start" value={start} setValue={setStart} />
        <TextForm name="end" value={end} setValue={setEnd} />

        <button
          className="bg-blue-500 select-none hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={(event) => {
            event.stopPropagation();

            console.log(`Sending: ${client} - ${job} - ${start} - ${end}`);
            console.log(events);
            dispatch({ type: "increase", name: job });
            //Clean Form
            setClient("");
            setJob("");
            setStart("");
            setEnd("");
          }}
        >
          Save
        </button>
      </EventForm>
    </>
  );
};

const TextForm: React.FC<EventProps> = ({
  name,
  value,
  setValue,
}): JSX.Element => {
  return (
    <div className="block text-gray-700 text-sm font-bold mb-">
      <input
        autoComplete="off"
        className="text-center rounded-full"
        type="text"
        placeholder={name.toLowerCase()}
        name={name}
        value={value}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    </div>
  );
};
