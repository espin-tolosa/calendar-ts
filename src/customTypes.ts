import { event } from "./interfaces";

export namespace CustomTypes {
  /**
   * Template type created to store React ref to HTML DOM elements
   * which allows null values required in cases such as:
   * - before the first DOM is rendered
   * - after the component is unmounted
   */
  export type NullableRef<T> = React.RefObject<T> | null;
  /**
   * Type designed to store a local representation of the remote events state
   */
  export type State = Array<event>;

  /**
   * Options to dispatch actions that manipulate the local representation of the events state
   */
  export type DispatchLocalStateEvents =
    | "appendarray"
    | "deletebyid"
    | "replacebyid"
    | "update"
    | "updateDnD";

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

export namespace CustomValues {
  /**
   * A constant that stores an event that is considered null by any consumer
   */
  export const nullEvent: event = {
    id: 0,
    client: "",
    job: "",
    start: "",
    end: "",
  };
}
