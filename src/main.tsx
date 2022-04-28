import React from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { App } from "@/App";
import { DOMRefsContext } from "@/globalStorage/DOMRefs";
import { PushedDays } from "@/hooks/usePushDays";
import { KeyBuffer } from "@/globalStorage/keyBuffer";
import { TemporaryEvent } from "@/globalStorage/temporaryEvents";
import { TopNavRef } from "@/globalStorage/topNavSize";
import { CurrentMonthRef } from "@/globalStorage/currentMonthReference";
import { IsFetchingEvents } from "@/hooks/useIsFetchingEvents";
import { IsDraggingEvent } from "@/hooks/useIsDragging";
import { ControllerProvider } from "@/hooks/useController";
import { ControllerProviderDates } from "@/hooks/useControllerDate";
import { UserPreferences } from "@/hooks/useLocalUserPreferences";
import { EventsDispatcher } from "@/hooks/useEventsState";
import { EventInController } from "@/globalStorage/eventSelected";
import { EventsStatus } from "@/hooks/useEventsStatus";
import { UserSession } from "@/hooks/useUserSession";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DOMRefsContext>
      <PushedDays>
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
      </PushedDays>
    </DOMRefs.Context>
  </React.StrictMode>
);
