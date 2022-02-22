import React from "react";
import ReactDOM from "react-dom";
import "@/index.css";
import App from "./App";
import { UserSession } from "@/hooks/useUserSession";
import { EventsDispatcher } from "@/hooks/useEventsApi";
import { UserPreferences } from "@/hooks/useLocalUserPreferences";
import { EventInController } from "@components/Controller/main";
import { ControllerProvider } from "@/hooks/useController";
import { DragDropContext } from "react-beautiful-dnd";

ReactDOM.render(
  <React.StrictMode>
    <DragDropContext
      onDragEnd={(e) => {
        console.log(e);
      }}
    >
      <ControllerProvider>
        <EventInController>
          <UserPreferences>
            <EventsDispatcher>
              <UserSession>
                <App />
              </UserSession>
            </EventsDispatcher>
          </UserPreferences>
        </EventInController>
      </ControllerProvider>
    </DragDropContext>
  </React.StrictMode>,
  document.getElementById("root")
);
