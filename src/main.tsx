import React from "react";
import ReactDOM from "react-dom";
import "@/index.css";
import App from "@/App";
import { UserSession } from "@/hooks/useUserSession";
import { EventsDispatcher } from "@/hooks/useEventsState";
import { UserPreferences } from "@/hooks/useLocalUserPreferences";

import { ControllerProvider } from "@/hooks/useController";
import { ControllerProviderDates } from "@/hooks/useControllerDate";
import { IsDraggingEvent } from "@/hooks/useIsDragging";
import { EventsStatus } from "@/hooks/useEventsStatus";
import { IsFetchingEvents } from "@/hooks/useIsFetchingEvents";
import { CurrentMonthRef } from "@/globalStorage/currentMonthReference";
import { TopNavRef } from "@/globalStorage/topNavSize";
import { DOMRefs } from "@/globalStorage/DOMRefs";
import { TemporaryEvent } from "@/globalStorage/temporaryEvents";
import { KeyBuffer } from "@/globalStorage/keyBuffer";
import { EventInController } from "@/globalStorage/eventSelected";

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
                        <EventsDispatcher>
                          <EventInController>
                            <EventsStatus>
                              <UserSession>
                                <App />
                              </UserSession>
                            </EventsStatus>
                          </EventInController>
                        </EventsDispatcher>
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
