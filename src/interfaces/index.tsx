import { ReactChildren, ReactChild } from "react";

export type Date = string;

export interface Children {
  children: ReactChild | ReactChildren;
}

export interface event {
  id: number;
  client: string;
  job: string;
  start: string;
  end: string;
}

export type setstate<S> = React.Dispatch<React.SetStateAction<S>>;
