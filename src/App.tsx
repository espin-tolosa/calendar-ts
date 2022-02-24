import "@/index.css";
import Codelink from "@/pages/Codelink";
import Login from "@/pages/Login/Login";
import { useUserSession } from "./hooks/useUserSession";
import { DragDropContext } from "react-beautiful-dnd";
//import { fetchEvent } from "./utils/Fetch";
import { useEventDispatch, useEventState } from "@/hooks/useEventsApi";
import { api } from "@/static/apiRoutes";
import { event, objectKeys } from "@interfaces/index";

async function fetchEvent(
  action: string,
  event: event = { id: 0, client: "", job: "", start: "", end: "" }
) {
  const data = new FormData();
  if (typeof event === "undefined") {
    data.append("json", JSON.stringify({ action }));
  } else {
    data.append("json", JSON.stringify({ action, ...event }));
  }
  return fetch(api.routes.events, {
    method: "POST",
    body: data,
  });
}

export default function App() {
  const { value } = useUserSession();
  const eventDispatcher = useEventDispatch();
  const allEvents = useEventState();

  {
    /*this code is forcing enter in the calendar automatically*/
  }
  return !value() ? (
    <Login />
  ) : (
    <DragDropContext
      onDragUpdate={(result) => console.log("Drag update", result)}
      onDragEnd={(result) => {
        const { source, destination } = result;
        console.log("source", source);
        console.log("destination", destination);
        const event = allEvents.find((e) => e.id === source.index)!;
        const fetchResultPUT = fetchEvent("PUT", {
          id: event.id,
          client: event.client,
          job: event.job,
          start: event.start,
          end: destination?.droppableId!,
        });

        fetchResultPUT
          .then((res: any) => res.json())
          .then((json) => {
            eventDispatcher({
              type: "replacebyid",
              payload: [
                {
                  id: event.id,
                  client: event.client,
                  job: event.job,
                  start: event.start,
                  end: destination?.droppableId!,
                },
              ],
            });
          });
      }}
    >
      <Codelink />
    </DragDropContext>
  );
}
