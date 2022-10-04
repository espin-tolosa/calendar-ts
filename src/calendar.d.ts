declare namespace jh
{
    interface EnvDefault {
        VITE_HTML_PROTOCOL: string;
        VITE_TARGET_HOST: string;
        VITE_TARGET_PORT: string;
        VITE_API_PREFIX: string;
        VITE_EVENT_RESOURCE: string;
        VITE_USER_RESOURCE: string;
        VITE_STYLE_RESOURCE: string;
    }
    interface Routes
    {
        user : string;
        event: string;
        style: string;
    }

    interface RouteParams
    {
        user: string;
    }

    type SpaUserType = "master" | "partner" | "client";
    type SpaPages = "board" | "settings" | "logout";
    
    namespace date
    {
      type representation = string;
      type monthData = { year: number; month: number };
    }

    namespace response
    {
      type maybe<T> =
        | { success: true; response: T }
        | { success: false; response?: T };
      type clients = Array<string>;
      type colors = Record<string, { primary: string; secondary: string }>;
      type styles = {
        clients: clients;
        colors: colors;
        update: React.Dispatch<React.SetStateAction<jh.response.colors>>;
      };
    }

    namespace event
    {
      export type type =
        | ""
        | "roothead"
        | "rootholder"
        | "tailhead"
        | "tailholder";
    }

    type dragDirection = "backward" | "forward" | "none";

    export interface event
    {
      id: number;
      client: string;
      job: string;
      start: string;
      end: string;
      mutable?: {
        dragDirection: dragDirection;
        eventRef: HTMLDivElement;
        index: number;
      };
      type: event.type;
    }

    interface textArea
    {
        textArea: number,
        setTextArea: React.Dispatch<React.SetStateAction<number>>,
        textEvent: number,
        setTextEvent: React.Dispatch<React.SetStateAction<number>>
    }
}

declare namespace CustomTypes {
  /**
   * Type designed to store a local representation of the remote events state
   */
  export type State = Array<jh.event>;

  /**
   * Options to dispatch actions that manipulate the local representation of the events state
   */
  export type DispatchLocalStateEvents =
    | "syncDB"
    | "delete"
    | "update"
    | "unmount"
    | "tonull"
    | "fromnull";

  /**
   * Options to send a query by POST method using fetch to Backend API events
   */
  export type OptionsEventsAPI =
    | "GET"
    | "GET_ALL"
    | "GET_FROM"
    | "POST"
    | "PUT"
    | "DELETE"
    | "DELETE_ALL";
}
