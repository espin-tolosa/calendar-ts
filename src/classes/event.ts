// Type of event data

import { CustomValues } from "@/customTypes";
import { event } from "@/interfaces";

// Parent: has all its attributes matched with some database entry

// Placeholder: id = -parentId, start =  [parentStart,parentEnd], end = "0" (no used value)

// Children: has all its attributes inherit from its parent with following modification:
//						job = "#isChildren" (reserved keyword, expected to not be used by end users)
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

  static transformToParentId(event: event) {
    return Math.abs(event.id);
  }

  static getParentEventFrom(state: Array<event>, id: number) {
    return state.find((e) => e.id === id) || CustomValues.nullEvent;
  }
  static getParentEvent(family: Array<event>) {
    const parentId = family.at(0)?.id || 0;
    //return all events that has the same parentId
    return (
      family.find(
        (e) =>
          EventClass.transformToParentId(e) === parentId &&
          e.job !== "#isChildren"
      ) || CustomValues.nullEvent
    );
  }

  static isNull(event: event) {
    return (
      !event.id && !event.client && !event.job && !event.start && !event.end
    );
  }

  static isChildren(event: event): boolean {
    return event.job === "#isChildren";
  }

  static isPlaceholder(event: event): boolean {
    return event.id < 0;
  }

  static isParent(event: event): boolean {
    return !this.isChildren(event) && !this.isPlaceholder(event);
  }

  static getUnusedId() {
    const lastId = 100000;
    return lastId;
  }
}
