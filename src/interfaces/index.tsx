export namespace event {
  export type date = string;
}

export interface objectKeys<V> {
  [key: string]: V;
}

export interface Children {
  children: React.ReactNode;
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

export interface loginForm {
  user: string;
  password: string;
}

export type setstate<S> = React.Dispatch<React.SetStateAction<S>>;

export type children = { children: React.ReactNode };

export type composition = React.FC<children>;
