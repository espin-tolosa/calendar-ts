import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";

//simple contexts
import { DOMRefsContext } from "./context/DOMRefs";
import { CurrentMonthRef } from "./context/currentMonthReference";
import { EventInDnD } from "./context/dndEventRef";
import { EventInController } from "./context/eventSelected";
import { KeyBuffer } from "./context/keyBuffer";
import { TemporaryEvent } from "./context/temporaryEvents";
import { TopNavRef } from "./context/topNavSize";

//complex contexts
import { PushedDays } from "./hooks/usePushDays";
import { IsFetchingEvents } from "./hooks/useIsFetchingEvents";
import { IsDraggingEvent } from "./hooks/useIsDragging";
import { ControllerProvider } from "./hooks/useController";
import { ControllerProviderDates } from "./hooks/useControllerDate";
import { UserPreferences } from "./hooks/useLocalUserPreferences";
import { EventsDispatcher } from "./hooks/useEventsState";
import { EventsStatus } from "./hooks/useEventsStatus";
import { UserSession } from "./hooks/useUserSession";
import { ClientsStyles } from "./context/queryClientStyles";

const root = window.document.getElementById("root") as HTMLDivElement;

createRoot(root).render(
  <StrictMode>
    <ClientsStyles>
      <DOMRefsContext>
        <CurrentMonthRef>
          <EventInDnD>
            <EventInController>
              <KeyBuffer>
                <TemporaryEvent>
                  <TopNavRef>
                    <PushedDays>
                      <IsFetchingEvents>
                        <IsDraggingEvent>
                          <ControllerProvider>
                            <ControllerProviderDates>
                              <UserPreferences>
                                <EventsDispatcher>
                                  <EventsStatus>
                                    <UserSession>
                                      <App />
                                    </UserSession>
                                  </EventsStatus>
                                </EventsDispatcher>
                              </UserPreferences>
                            </ControllerProviderDates>
                          </ControllerProvider>
                        </IsDraggingEvent>
                      </IsFetchingEvents>
                    </PushedDays>
                  </TopNavRef>
                </TemporaryEvent>
              </KeyBuffer>
            </EventInController>
          </EventInDnD>
        </CurrentMonthRef>
      </DOMRefsContext>
    </ClientsStyles>
  </StrictMode>
);
