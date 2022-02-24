import "@/index.css";
import Codelink from "@/pages/Codelink";
import Login from "@/pages/Login/Login";
import { useUserSession } from "./hooks/useUserSession";
import { DragDropContext } from "react-beautiful-dnd";
//import { fetchEvent } from "./utils/Fetch";
import { useEventDispatch, useEventState } from "@/hooks/useEventsApi";
import { api } from "@/static/apiRoutes";
import { event, objectKeys } from "@interfaces/index";
import { DateService } from "./utils/Date";

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
      onBeforeCapture={(result) => {
        console.log("beforecapture", result);
      }}
      onDragUpdate={(result) => {
        const { source, destination } = result;
        const event = allEvents.find((e) => e.id === source.index)!;
        if (destination === null) {
          return;
        }
        const spread = DateService.DaysFromStartToEnd(
          event.start,
          destination?.droppableId!
        );
        console.log("SPREAD", spread);
        if (spread < 0) return;
        eventDispatcher({
          type: "deletebyid_test",
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
        eventDispatcher({
          type: "appendarray",
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
      }}
      onDragEnd={(result) => {
        const { source, destination } = result;
        if (destination === null) return;

        const event = allEvents.find((e) => e.id === source.index)!;
        const spread = DateService.DaysFromStartToEnd(
          event.start,
          destination?.droppableId!
        );
        const endTarget = DateService.DaysFromStartToEnd(
          event.end,
          destination?.droppableId!
        );

        if (spread < 0) return;
        if (endTarget === 0) return;
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
            console.log("PUT", json);
            eventDispatcher({
              type: "deletebyid_test",
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
            eventDispatcher({
              type: "appendarray",
              payload: [json[0]],
            });
          });
      }}
    >
      <Codelink />
    </DragDropContext>
  );
}
