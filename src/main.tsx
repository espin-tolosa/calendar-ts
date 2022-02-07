import React from "react";
import ReactDOM from "react-dom";
import "@/index.css";
import App from "./App";
import { UserSession } from "@/hooks/useUserSession";
import { EventsDispatcher } from "./hooks/useEventsApi";
import { UserPreferences } from "@/hooks/useLocalUserPreferences";

ReactDOM.render(
  <React.StrictMode>
    <UserPreferences>
      <EventsDispatcher>
        <UserSession>
          <App />
        </UserSession>
      </EventsDispatcher>
    </UserPreferences>
  </React.StrictMode>,
  document.getElementById("root")
);
