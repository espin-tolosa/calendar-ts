import { encodedTokenFromAPI, event, token, tokenData } from "./interfaces";

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
    | "syncDB"
    | "delete"
    | "update"
    | "override"
    | "unmount";

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

  export type Month = {
    year: number;
    month: number;
  };
}

//TODO: create a factory to automate instantiation inside functions by declaring the type
/**
 * A constant that stores an event that is considered null by any consumer
 */
export const nullEvent = (): event => ({
  id: 0,
  client: "",
  job: "",
  start: "",
  end: "",
});

// Create new instances each time a nullToken is required
// it prevents againts sharing multiple instances of same object in different parts of the code
export const nullToken = (): token => ({
  exp: 0,
  aud: "",
  data: { iss: "", uid: "", usr: "", aut: "", rus: "" },
});

export const nullEncodedToken = (): encodedTokenFromAPI => ({ data: "" });
