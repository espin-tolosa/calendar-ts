import React from "react";
import ReactDOM from "react-dom";
import "@/index.css";
import App from "./App";
import { UserSession } from "@/hooks/useUserSession";
import { EventsDispatcher } from "./hooks/useEventsApi";

ReactDOM.render(
  <React.StrictMode>
    <EventsDispatcher>
      <UserSession>
        <App />
      </UserSession>
    </EventsDispatcher>
  </React.StrictMode>,
  document.getElementById("root")
);
