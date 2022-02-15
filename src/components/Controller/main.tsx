import { useEventDispatch, useEventState } from "@/hooks/useEventsApi";
import { composition, event } from "@/interfaces";
import { Event } from "@/components/Event/main";
import React, { createContext, Dispatch, useContext, useState } from "react";
import { useDate } from "./handlers";
//import { onChange } from "./handlers";
import * as tw_Controller from "./tw";
import tw from "tailwind-styled-components";
import {
  useControllerDispatch,
  useControllerState,
} from "@/hooks/useController";
import { DateService } from "@/utils/Date";
import { isValidEvent } from "@/utils/ValidateEvent";

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

  /*  parallel change consume date context */
  const { start, end } = useControllerState();
  const dispatchController = useControllerDispatch();

  const eventDispatcher = useEventDispatch();

  return (
    <tw_Controller.form
      action="post"
      onSubmit={(event) => {
        event.preventDefault();
        console.log("Hello");
      }}
    >
      {/* new button */}
      <tw_Controller.button
        $display={true}
        type="submit"
        value="Create"
        title="Testing to new dispatch event"
        onClick={() => {
          // TODO: check if is valid event
          if (!isValidEvent) {
            return;
          }

          eventDispatcher({
            type: "appendarray",
            payload: [
              {
                id: Math.floor(Math.random() * 1000), //TODO:
                client,
                job,
                start,
                end,
              },
            ],
          });

          dispatchController({
            type: "setDates",
            payload: { start: "", end: "" },
          });

          setJob(() => "");
          setClient(() => "default");
        }}
      />
      {/* create button */}
      <tw_Controller.button
        $display={true}
        type={"button"}
        value="Fetch"
        onClick={() => {
          fetch("./backend/test.php")
            .then((res) => res.json())
            .then((json) => console.log(json));
        }}
      />
      {/* create button */}
      <tw_Controller.button
        $display={false}
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
        $display={false}
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
        $display={false}
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
      <StyledSelect value={client} onChange={(e) => setClient(e.target.value)}>
        <option value="default" hidden>
          Select Client
        </option>
        {CLIENTS.map((clientIterator, index) => {
          return (
            <option key={index} value={clientIterator}>
              {clientIterator}
            </option>
          );
        })}
      </StyledSelect>
      {/* parallel change on context testing */}
      <tw_Controller.startEnd>
        {/* start field */}
        <tw_Controller.date
          type="text"
          name="start"
          id="start"
          value={DateService.ExportDateToControllerValue(start)} //TODO: function to represent string dates in the desired user format keeping internal consistency as: yyyy-mm-dd
          autoComplete="off"
          onChange={() => {
            /* onChange */
          }}
          onKeyDown={() => {
            /* backslash */
          }}
          placeholder="start date"
          title="input: yy/mm/dd, it also will accepts: dd/mm/yy"
        />
        {/* end field */}
        <tw_Controller.date
          type="text"
          name="end"
          id="end"
          value={DateService.ExportDateToControllerValue(end)} //TODO: same as start
          autoComplete="off"
          onChange={() => {
            /* onChange */
          }}
          onKeyDown={() => {
            /* backslash */
          }}
          placeholder="end date"
          title="input: yy/mm/dd, it also will accepts: dd/mm/yy"
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

      {eventSelected ? <Event event={eventSelected} /> : <></>}
    </tw_Controller.form>
  );
};
const CLIENTS = [
  "Client_1",
  "Client_2",
  "Client_3",
  "Client_4",
  "Client_5",
  "Client_6",
  "Client_7",
  "Client_8",
  "Client_9",
];

const StyledSelect = tw.select`
  border-none py-px padding-x-clamp button-shadow text-effect rounded-sm cursor-pointer
`;

const DropDownClientMenu = () => {
  return (
    <StyledSelect id={"client"}>
      <option value={""}>
        Client ↓
        {
          //TODO I've removed this from <option value={""} default select option> because this use is not intended on React (https://techstrology.com/warning-received-true-for-a-non-boolean-attribute-name-in-reactjs/)
        }
      </option>
      {CLIENTS.map((clientIterator, index) => {
        return (
          <option key={index} value={clientIterator}>
            {clientIterator}
          </option>
        );
      })}
    </StyledSelect>
  );
};

/* OLD START END FORM FIELD WITH BACKSLASH FUNCTION */

//      <tw_Controller.startEnd>
//        {/* start field */}
//        <tw_Controller.date
//          type="text"
//          name="start"
//          id="start"
//          value={(() => start)()} //TODO: function to represent string dates in the desired user format keeping internal consistency as: yyyy-mm-dd
//          autoComplete="off"
//          onChange={onChangeStart}
//          onKeyDown={removeBackSlashStart}
//          placeholder="start date"
//          title="input: yy/mm/dd, it also will accepts: dd/mm/yy"
//        />
//        {/* end field */}
//        <tw_Controller.date
//          type="text"
//          name="end"
//          id="end"
//          value={(() => end)()} //TODO: same as start
//          autoComplete="off"
//          onChange={onChangeEnd}
//          onKeyDown={removeBackSlashEnd}
//          placeholder="end date"
//          title="input: yy/mm/dd, it also will accepts: dd/mm/yy"
//        />
//      </tw_Controller.startEnd>
