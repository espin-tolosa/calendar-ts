import React from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { App } from "@/App";
import { DOMRefsContext } from "@/context/DOMRefs";
import { PushedDays } from "@/hooks/usePushDays";
import { KeyBuffer } from "@/context/keyBuffer";
import { TemporaryEvent } from "@/context/temporaryEvents";
import { TopNavRef } from "@/context/topNavSize";
import { CurrentMonthRef } from "@/context/currentMonthReference";
import { IsFetchingEvents } from "@/hooks/useIsFetchingEvents";
import { IsDraggingProvider } from "@/hooks/useIsDragging";
import { ControllerProvider } from "@/hooks/useController";
import { ControllerProviderDates } from "@/hooks/useControllerDate";
import { UserPreferences } from "@/hooks/useLocalUserPreferences";
import { EventsDispatcher } from "@/hooks/useEventsState";
import { EventInController } from "@/context/eventSelected";
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
                </IsFetchingEvents>
              </CurrentMonthRef>
            </TopNavRef>
          </TemporaryEvent>
        </KeyBuffer>
      </PushedDays>
    </DOMRefsContext>
  </React.StrictMode>
);
