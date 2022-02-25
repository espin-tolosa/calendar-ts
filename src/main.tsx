import React from "react";
import ReactDOM from "react-dom";
import "@/index.css";
import App from "./App";
import { UserSession } from "@/hooks/useUserSession";
import { EventsDispatcher } from "@/hooks/useEventsApi";
import { UserPreferences } from "@/hooks/useLocalUserPreferences";
import { EventInController } from "@components/Controller/main";
import { ControllerProvider } from "@/hooks/useController";
import { DayLock } from "./hooks/useDayLock";

ReactDOM.render(
  <React.StrictMode>
    <ControllerProvider>
      <UserPreferences>
        <DayLock>
          <EventsDispatcher>
            <EventInController>
              <UserSession>
                <App />
              </UserSession>
            </EventInController>
          </EventsDispatcher>
        </DayLock>
      </UserPreferences>
    </ControllerProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
