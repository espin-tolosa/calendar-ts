type yearMonth = { year: number; month: number };

// root Actor: useFetchClientStyle.tsx
type ClientsFromAPI = Array<string>;
type StylesFromAPI = Record<string, { primary: string; secondary: string }>;
type ResponseFromAPI = {
  clients: ClientsFromAPI;
  styles: StylesFromAPI;
};

type Maybe<T> =
  | { success: true; response: T }
  | { success: false; response?: T };
