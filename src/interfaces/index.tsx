import { ReactChildren, ReactChild } from "react";

export type Date = string;

export interface Children {
  children: ReactChild | ReactChildren;
}

export interface eventType {
  id: number;
  client: string;
  job: string;
  start: string;
  end: string;
}
