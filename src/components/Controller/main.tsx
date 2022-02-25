import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as tw_Controller from "./tw";
import { useEventDispatch, useEventState } from "@/hooks/useEventsApi";
import { composition, event } from "@/interfaces";
import { Event } from "@/components/Event/main";
import tw from "tailwind-styled-components";
import {
  useControllerDispatch,
  useControllerState,
} from "@/hooks/useController";
import { DateService } from "@/utils/Date";
import { isValidEvent } from "@/utils/ValidateEvent";
import { useUserSession } from "@/hooks/useUserSession";
import { api } from "@/static/apiRoutes";
import { useLocalUserPreferencesContext } from "@/hooks/useLocalUserPreferences";

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
  const [id, setId] = useState(0);
  const [client, setClient] = useState("");
  const [job, setJob] = useState("");
  const { start, end } = useControllerState();
  const [description, setDescription] = useState("");
  const setEventController = useSetEventSelected();

  /*  parallel change consume date context */
  const dispatchController = useControllerDispatch();
  const { dispatchLocalState } = useLocalUserPreferencesContext();
  const initDate = useRef(false);

  useEffect(() => {
    console.log("Event Selected");
    setId(eventSelected?.id || 0);
    setClient(eventSelected?.client || "");
    setJob(eventSelected?.job || "");
    dispatchController({
      type: "setDates",
      payload: { start: "", end: "" },
    });
    dispatchController({
      type: "setDates",
      payload: {
        start: eventSelected?.start || "",
        end: eventSelected?.end || "",
      },
    });
  }, [eventSelected]);

  const isDateForm = start !== "" && end !== "";
  const initState = initDate.current;
  useEffect(() => {
    initState && isDateForm && dispatchLocalState({ type: "toggleController" });
    initDate.current = true;
    return () => {
      isDateForm && dispatchLocalState({ type: "toggleController" });
    };
  }, [start, end]);

  const eventDispatcher = useEventDispatch();
  const event: event = {
    id: 1,
    client: "Test Fetch",
    job: "Post",
    start: "2022-02-01",
    end: "2022-02-02",
  };

  return (
    <tw_Controller.form
      action="post"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      {/* new button */}
      <tw_Controller.button
        $display={true}
        type="submit"
        value={eventSelected ? "Copy" : "Save"}
        title="Testing to new dispatch event"
        onClick={() => {
          // TODO: check if is valid event
          if (!isValidEvent) {
            return;
          }

          const result = fetchEvent("POST", {
            id: Math.floor(Math.random() * 1000),
            client,
            job,
            start,
            end,
          });
          result
            .then((res: any) => res.json())
            .then((json) => {
              eventDispatcher({
                type: "appendarray",
                payload: [
                  {
                    id: json[0].id,
                    client: json[0].client,
                    job: json[0].job,
                    start: json[0].start,
                    end: json[0].end,
                  },
                ],
              });
            });

          dispatchController({
            type: "setDates",
            payload: { start: "", end: "" },
          });

          setJob(() => "");
          setEventController(null);
          setClient(() => "default");
        }}
      />
      <tw_Controller.startEnd>
        {/* start field */}
        <DateField date={start} name="start" />
        {/* end field */}
        <DateField date={end} name="end" />
      </tw_Controller.startEnd>
      {/* client field */}
      <StyledSelect
        value={client}
        onChange={(e) => setClient(e.target.value)}
        autoFocus
      >
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
      {/* job field */}
      <JobField value={job} setValue={setJob} />
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

async function fetchEvent(
  action: string,
  event: event = { id: 0, client: "", job: "", start: "", end: "" }
) {
  const data = new FormData();
  const dataJSON = JSON.stringify({ action, ...event }); //! event should be passed as plain object to the api
  data.append("json", dataJSON);
  return fetch(api.routes.events, {
    method: "POST",
    body: data,
  });
}

function ControllerButton({
  onClick,
  name,
  display,
}: {
  onClick: any;
  name: string;
  display: boolean;
}) {
  return (
    <tw_Controller.button
      $display={display}
      type="button"
      value={name}
      onClick={onClick}
    />
  );
}

const DateField = ({ date, name }: { date: string; name: string }) => {
  return (
    <tw_Controller.date
      type="text"
      name={name}
      id={name}
      value={DateService.ExportDateToControllerValue(date)}
      autoComplete="off"
      placeholder={`${name} date`}
    />
  );
};

const JobField = ({
  value,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <tw_Controller.job
      onChange={(e) => {
        setValue(e.target.value);
      }}
      type="text"
      name="job"
      id="job"
      value={value}
      placeholder="Job"
    />
  );
};
