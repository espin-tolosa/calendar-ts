import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useMemo,
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
import { useListenWindowSize } from "@/hooks/useResponsiveLayout";

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

const CreateEvent = () => {
  const eventSelected = useEventSelected();
  const events = useEventState();
  //const [id, setId] = useState(0);
  //const [client, setClient] = useState("");
  //const [job, setJob] = useState("");
  const { id, client, job, start, end } = useControllerState();
  //const [description, setDescription] = useState("");
  const setEventController = useSetEventSelected();

  /*  parallel change consume date context */
  const dispatchController = useControllerDispatch();
  const { dispatchLocalState } = useLocalUserPreferencesContext();
  const initDate = useRef(false);
  const isLargeWindow = useListenWindowSize();

  useEffect(() => {
    const id = eventSelected?.id || 0;
    const client = eventSelected?.client || "";
    const job = eventSelected?.job || "";
    dispatchController({
      type: "setController",
      payload: { id, client, job, start: "", end: "" },
    });
    dispatchController({
      type: "setDates",
      payload: {
        id: 0,
        client: "",
        job: "",
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
        id={"save"}
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
            type: "setController",
            payload: { id: 0, client: "default", job: "", start: "", end: "" },
          });

          setEventController(null);
        }}
      />
      <tw_Controller.startEnd>
        {/* start field */}
        <DateField date={start} name="start" autoFocus={false} />
        {/* end field */}
        <DateField date={end} name="end" autoFocus={true} />
      </tw_Controller.startEnd>

      {/* client field */}
      <StyledSelect
        value={client}
        id={"select"}
        onChange={(e) =>
          dispatchController({
            type: "setClient",
            payload: {
              id: 0,
              client: e.target.value,
              job: "",
              start: "",
              end: "",
            },
          })
        }
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
      <JobField
        value={job}
        setValue={(job: string) => {
          dispatchController({
            type: "setJob",
            payload: {
              id: 0,
              client: "",
              job,
              start: "",
              end: "",
            },
          });
        }}
      />
      {/*
	<tw_Controller.description_wrap>
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
	
	*/}
      {!isLargeWindow && (
        <tw_Controller.button
          $display={true}
          type="button"
          value={"Close"}
          title="Close control panel"
          onClick={() => {
            setEventController(null);
            dispatchController({
              type: "clearDates",
              payload: { id: 0, client: "", job: "", start: "", end: "" },
            });
          }}
        />
      )}
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
  border-none py-px padding-x-clamp button-shadow text-effect rounded-sm cursor-pointer outline-none
`;

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

const DateField = ({
  date,
  name,
  autoFocus,
}: {
  date: string;
  name: string;
  autoFocus: boolean;
}) => {
  return (
    <>
      <tw_Controller.date
        type="text"
        name={name}
        readOnly={true}
        id={name}
        value={DateService.ExportDateToControllerValue(date)}
        autoComplete="off"
        placeholder={`${name} date`}
        autoFocus={autoFocus}
      />
    </>
  );
};

const JobField = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (job: string) => void;
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

export const CreateEventMemo = React.memo(CreateEvent);
