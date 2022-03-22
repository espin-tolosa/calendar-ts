import React from "react";
import ReactDOM from "react-dom";
import "@/index.css";
import App from "./App";
import { UserSession } from "@/hooks/useUserSession";
import { EventsDispatcher } from "@/hooks/useEventsState";
import { UserPreferences } from "@/hooks/useLocalUserPreferences";
import { EventInController } from "@components/Controller/main";
import { ControllerProvider } from "@/hooks/useController";
import { ControllerProviderDates } from "@/hooks/useControllerDate";
import { DayLock } from "@/hooks/useDayLock";
import { IsDraggingEvent } from "./hooks/useIsDragging";
import { EventsStatus } from "./hooks/useEventsStatus";
import { IsFetchingEvents } from "./hooks/useIsFetchingEvents";
import { CurrentMonthRef } from "./globalStorage/currentMonthReference";
import { TopNavRef } from "./globalStorage/topNavSize";
import { DOMRefs } from "./globalStorage/DOMRefs";
import { TemporaryEvent } from "./globalStorage/temporaryEvents";
import { KeyBuffer } from "./globalStorage/keyBuffer";

ReactDOM.render(
  <React.StrictMode>
    <DOMRefs.Context>
      <KeyBuffer>
        <TemporaryEvent>
          <TopNavRef>
            <CurrentMonthRef>
              <IsFetchingEvents>
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
              </IsFetchingEvents>
            </CurrentMonthRef>
          </TopNavRef>
        </TemporaryEvent>
      </KeyBuffer>
    </DOMRefs.Context>
  </React.StrictMode>,
  document.getElementById("root")
);
