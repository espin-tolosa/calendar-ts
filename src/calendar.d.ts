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
  }
}
