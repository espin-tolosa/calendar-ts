import { ReactChildren, ReactChild } from "react";

export namespace event {
  export type date = string;
}

export interface objectKeys<V> {
  [key: string]: V;
}

export interface Children {
  children: ReactChild | ReactChildren;
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

export interface token {
  name: string;
  exp: number;
  data: { iss: string; usr: string; aut: string; rus: string };
  // whatever else is in the JWT.
}

export type setstate<S> = React.Dispatch<React.SetStateAction<S>>;

export type children = { children: React.ReactNode };
export type composition = React.FC<children>;
