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
import { IsDraggingEvent } from "@/hooks/useIsDragging";
import { ControllerProvider } from "@/hooks/useController";
import { ControllerProviderDates } from "@/hooks/useControllerDate";
import { UserPreferences } from "@/hooks/useLocalUserPreferences";
import { EventsDispatcher } from "@/hooks/useEventsState";
import { EventInController } from "@/context/eventSelected";
import { EventsStatus } from "@/hooks/useEventsStatus";
import { UserSession } from "@/hooks/useUserSession";
import { EventInDnD } from "./context/dndEventRef";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DOMRefsContext>
      <EventInDnD>
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
      </EventInDnD>
    </DOMRefsContext>
  </React.StrictMode>
);
