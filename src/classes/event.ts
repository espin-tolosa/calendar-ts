// Type of event data

import { nullEvent } from "../interfaces";

// Parent: has all its attributes matched with some database entry

// Placeholder: id = -parentId, start =  [parentStart,parentEnd], end = "0" (no used value)

// Children: has all its attributes inherit from its parent with following modification:
//						type = "tailhead" (reserved keyword, expected to not be used by end users)
//						start = some Monday in the range [parentStart, parentEnd]

export class EventClass {
  id: number;
  client: string;
  job: string;
  start: string;
  end: string;

  constructor(
    id: number,
    client: string,
    job: string,
    start: string,
    end: string
  ) {
    this.id = id;
    this.client = client;
    this.job = job;
    this.start = start;
    this.end = end;
  }

  static getParentEventFrom(state: Array<jh.event>, id: number) {
    return state.find((e) => e.id === id) || nullEvent();
  }
  static getParentEvent(family: Array<jh.event>) {
    const parentId = family.at(0)?.id || 0;
    //return all events that has the same parentId
    return (
      family.find((e) => e.id === parentId && e.type === "roothead") ||
      nullEvent()
    );
  }

  static isNull(event: jh.event) {
    return (
      !event.id && !event.client && !event.job && !event.start && !event.end
    );
  }

  static isChildren(event: jh.event): boolean {
    return event.type === "tailhead";
  }

  static isPlaceholder(event: jh.event): boolean {
    return event.type.includes("holder");
  }

  static isParent(event: jh.event): boolean {
    return !this.isChildren(event) && !this.isPlaceholder(event);
  }

  static getUnusedId() {
    const lastId = 100000;
    return lastId;
  }
}
