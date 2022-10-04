import MasterApp from "./html/index";
import "../../Assets/index.css";
import { CurrentDays } from "../../Calendar/components/Month/components/CurrentDays";
import { ClientsStyles } from "../../Calendar/context/useFetchClientStyle";
import { DOMRefsContext } from "../../Calendar/context/DOMRefs";
import { CurrentMonthRef } from "../../Calendar/context/currentMonthReference";
import { EventInDnD } from "../../Calendar/context/dndEventRef";
import { EventInController } from "../../Calendar/context/eventSelected";
import { KeyBuffer } from "../../Calendar/context/keyBuffer";
import { TemporaryEvent } from "../../Calendar/context/temporaryEvents";
import { TopNavRef } from "../../Calendar/context/topNavSize";
import { PushedDays } from "../../Calendar/hooks/usePushDays";
import { IsFetchingEvents } from "../../Calendar/hooks/useIsFetchingEvents";
import { IsDraggingEvent } from "../../Calendar/hooks/useIsDragging";
import { ControllerProvider } from "../../Calendar/hooks/useController";
import { ControllerProviderDates } from "../../Calendar/hooks/useControllerDate";
import { UserPreferences } from "../../Calendar/hooks/useLocalUserPreferences";
import { EventsDispatcher } from "../../Calendar/hooks/useEventsState";
import { EventsStatus } from "../../Calendar/hooks/useEventsStatus";
import { UserSession } from "../../Calendar/hooks/useUserSession";
import { EventResizeObserver } from "../../Calendar/context/observeEventSize";
import { authLevel } from "../context/authLevel";

export const ContextualMasterApp = () => (
    <authLevel.Provider value={"master"} >
    <CurrentDays>
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
    <EventResizeObserver>
        <MasterApp/>
    </EventResizeObserver>
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
    </CurrentDays>
    </authLevel.Provider>
)