import { useEventDispatch, useEventState } from "@/hooks/useEventsApi";
import { composition, event } from "@/interfaces";
import { Event } from "@components/Event/main";
import React, { createContext, Dispatch, useContext, useState } from "react";
import { useDate } from "./handlers";
//import { onChange } from "./handlers";
import * as tw_Controller from "./tw";

const cEventSelected = createContext<event | null>(null);
const cSetEventSelected = createContext<
  Dispatch<React.SetStateAction<event | null>>
>(() => null);

export const useEventSelected = () => {
  return useContext(cEventSelected);
};
export const useSetEventSelected = () => {
  return useContext(cSetEventSelected);
};

export const EventInController: composition = ({ children }) => {
  const [eventSelected, setEventSelected] = useState<event | null>(null);
  return (
    <cEventSelected.Provider value={eventSelected}>
      <cSetEventSelected.Provider value={setEventSelected}>
        {children}
      </cSetEventSelected.Provider>
    </cEventSelected.Provider>
  );
};

export const CreateEvent = () => {
  const eventSelected = useEventSelected();
  const events = useEventState();
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [job, setJob] = useState("");

  const eventDispatcher = useEventDispatch();

  const [start, onChangeStart, removeBackSlashStart] = useDate();
  const [end, onChangeEnd, removeBackSlashEnd] = useDate();

  return (
    <tw_Controller.form
      action="post"
      onSubmit={(event) => {
        event.preventDefault();
        console.log("Hello");
      }}
    >
      {/* create button */}
      <tw_Controller.button
        type="submit"
        value="Create"
        onClick={() => {
          document.documentElement.style.setProperty(
            "--calendar_width",
            "900px"
          );
        }}
      />
      {/* reduce button */}
      <tw_Controller.button
        type="submit"
        value="Reduce"
        title="Testing to reduce calendar"
        onClick={() => {
          document.documentElement.style.setProperty(
            "--calendar_width",
            "740px"
          );
        }}
      />

      {/* delete button */}
      <tw_Controller.button
        type="submit"
        value="Test"
        title="Testing to new dispatch event"
        onClick={() => {
          const index = events.findIndex((event) => event.client === "Marcel");
          if (index > 0) {
            console.log("Founded Marcel at position", index);
            events[index].client = "Updated Marcel";
          }
        }}
      />

      <tw_Controller.startEnd>
        {/* start field */}
        <tw_Controller.date
          type="text"
          name="start"
          id="start"
          value={(() => start)()} //TODO: function to represent string dates in the desired user format keeping internal consistency as: yyyy-mm-dd
          autoComplete="off"
          onChange={onChangeStart}
          onKeyDown={removeBackSlashStart}
          placeholder="init: yy-mm-dd"
          title="input: dd/mm/yyyy, also accepts: dd/mm/yy"
        />
        {/* end field */}
        <tw_Controller.date
          type="text"
          name="end"
          id="end"
          value={(() => end)()} //TODO: same as start
          autoComplete="off"
          onChange={onChangeEnd}
          onKeyDown={removeBackSlashEnd}
          placeholder="end: yy-mm-dd"
          title="input: dd/mm/yyyy, also accepts: dd/mm/yy"
        />
      </tw_Controller.startEnd>

      {/* job field */}
      <tw_Controller.job
        onChange={(e) => {
          setJob(e.target.value);
        }}
        type="text"
        name="job"
        id="job"
        value={job}
        placeholder="Job"
      />
      <tw_Controller.description_wrap>
        {/* description optional field */}
        <tw_Controller.description
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          name="text"
          id="text"
          value={description}
          placeholder="Extra notes..."
        ></tw_Controller.description>
      </tw_Controller.description_wrap>
      {/* new button */}
      <tw_Controller.button
        type="submit"
        value="New"
        title="Testing to new dispatch event"
        onClick={() => {
          eventDispatcher({
            type: "appendarray",
            payload: [
              {
                id: Math.floor(Math.random() * 1000), //TODO:
                client: "test client",
                job,
                start: "20" + start, //TODO: refactor this by adding Date complete year fuction
                end: "20" + end,
              },
            ],
          });
        }}
      />
      {eventSelected ? <Event event={eventSelected} /> : <></>}
    </tw_Controller.form>
  );
};
