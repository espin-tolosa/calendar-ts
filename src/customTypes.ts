import { encodedTokenFromAPI, token } from "./interfaces";

//TODO: create a factory to automate instantiation inside functions by declaring the type
/**
 * A constant that stores an event that is considered null by any consumer
 */
export const nullEvent = (): jh.event => ({
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
  data: { iss: "", usr: "", aut: "", rus: "" },
});

export const nullEncodedToken = (): encodedTokenFromAPI => ({ data: "" });
