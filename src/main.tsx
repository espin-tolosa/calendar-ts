import React from "react";
import ReactDOM from "react-dom";
import "@/index.css";
import App from "./App";
import { UserSession } from "@/hooks/useUserSession";
import { EventsDispatcher } from "./hooks/useEventsApi";
import { UserPreferences } from "@/hooks/useLocalUserPreferences";
import { EventInController } from "./components/Controller/main";

ReactDOM.render(
  <React.StrictMode>
    <EventInController>
      <UserPreferences>
        <EventsDispatcher>
          <UserSession>
            <App />
          </UserSession>
        </EventsDispatcher>
      </UserPreferences>
    </EventInController>
  </React.StrictMode>,
  document.getElementById("root")
);
