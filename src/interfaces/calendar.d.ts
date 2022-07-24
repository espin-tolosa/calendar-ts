declare namespace jh {
  namespace date {
    type representation = string;
    type monthData = { year: number; month: number };
  }

  namespace response {
    type maybe<T> =
      | { success: true; response: T }
      | { success: false; response?: T };
    type clients = Array<string>;
    type colors = Record<string, { primary: string; secondary: string }>;
    type styles = {
      clients: clients;
      colors: colors;
    };
  }

  namespace event {
    export type type =
      | ""
      | "roothead"
      | "rootholder"
      | "tailhead"
      | "tailholder";
  }

  export interface event {
    id: number;
    client: string;
    job: string;
    start: string;
    end: string;
    mutable?: {
      bubble?: number;
      height: string;
      eventRef: HTMLDivElement;
      index: number;
    };
    type: event.type;
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
