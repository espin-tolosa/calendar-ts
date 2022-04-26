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
    | "override";

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
export namespace CustomValues {
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
    data: { iss: "", usr: "", aut: "", rus: "" },
  });

  export const nullEncodedToken = (): encodedTokenFromAPI => ({ data: "" });
}

export const CustomValues2 = {
  /**
   * A constant that stores an event that is considered null by any consumer
   */
  nullEvent: (): event => ({
    id: 0,
    client: "",
    job: "",
    start: "",
    end: "",
  }),

  // Create new instances each time a nullToken is required
  // it prevents againts sharing multiple instances of same object in different parts of the code
  nullToken: (): token => ({
    exp: 0,
    aud: "",
    data: { iss: "", usr: "", aut: "", rus: "" },
  }),

  nullEncodedToken: (): encodedTokenFromAPI => ({ data: "" }),
};

export function nullFactory<
  T extends event | token | tokenData | encodedTokenFromAPI
>(type: "event" | "token" | "encoded" | "data") {
  if (type === "event") {
    return Object.freeze(CustomValues.nullEvent()) as T;
  } else if (type === "token") {
    return Object.freeze(CustomValues.nullToken()) as T;
  } else if (type === "data") {
    return Object.freeze(CustomValues.nullToken().data) as T;
  } else {
    return Object.freeze(CustomValues.nullEncodedToken()) as T;
  }
}

//-----------------------------------
abstract class Creator {
  public abstract factoryMethod(): Product;
  public someOperation(): event | token | encodedTokenFromAPI {
    const product = this.factoryMethod();
    return product.operation();
  }
}

class ConcreteCreatorNullEvent extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProductNullEvent();
  }
}

class ConcreteCreatorNullToken extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProductNullToken();
  }
}

class ConcreteCreatorNullEncodedToken extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProductNullEncodedToken();
  }
}

interface Product {
  operation(): event | token | encodedTokenFromAPI;
}

class ConcreteProductNullEvent implements Product {
  public operation(): event {
    return CustomValues.nullEvent();
  }
}

class ConcreteProductNullToken implements Product {
  public operation(): token {
    return CustomValues.nullToken();
  }
}
class ConcreteProductNullEncodedToken implements Product {
  public operation(): encodedTokenFromAPI {
    return CustomValues.nullEncodedToken();
  }
}

function clientCode(creator: Creator) {
  // ...
  console.log(
    "Client: I'm not aware of the creator's class, but it still works.",
    creator.someOperation()
  );
  // ...
}

/**
 * The Application picks a creator's type depending on the configuration or
 * environment.
 */
clientCode(new ConcreteCreatorNullEvent());

clientCode(new ConcreteCreatorNullToken());

clientCode(new ConcreteCreatorNullEncodedToken());
