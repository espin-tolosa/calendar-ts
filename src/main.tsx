import React from "react";
import ReactDOM from "react-dom";
import "@/index.css";
import App from "./App";
import { UserSession } from "@/hooks/useUserSession";
import { EventsDispatcher } from "@/hooks/useEventsApi";
import { UserPreferences } from "@/hooks/useLocalUserPreferences";
import { EventInController } from "@components/Controller/main";
import { ControllerProvider } from "@/hooks/useController";
import { ControllerProviderDates } from "@/hooks/useControllerDate";
import { DayLock } from "@/hooks/useDayLock";
import { IsDraggingEvent } from "./hooks/useIsDragging";
import { EventsStatus } from "./hooks/useEventsStatus";

ReactDOM.render(
  <React.StrictMode>
    <IsDraggingEvent>
      <ControllerProvider>
        <ControllerProviderDates>
          <UserPreferences>
            <DayLock>
              <EventsDispatcher>
                <EventInController>
                  <EventsStatus>
                    <UserSession>
                      <App />
                    </UserSession>
                  </EventsStatus>
                </EventInController>
              </EventsDispatcher>
            </DayLock>
          </UserPreferences>
        </ControllerProviderDates>
      </ControllerProvider>
    </IsDraggingEvent>
  </React.StrictMode>,
  document.getElementById("root")
);
