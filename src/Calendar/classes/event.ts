// Type of event data

import { DateService, DayWeek } from "../utils/Date";
import { nullEvent } from "../interfaces";

// Parent: has all its attributes matched with some database entry

// Placeholder: id = -parentId, start =  [parentStart,parentEnd], end = "0" (no used value)

// Children: has all its attributes inherit from its parent with following modification:
//						type = "tailhead" (reserved keyword, expected to not be used by end users)
//						start = some Monday in the range [parentStart, parentEnd]

export class EventClass
{
    id: number;
    client: string;
    job: string;
    start: string;
    end: string;

    constructor(id: number, client: string, job: string, start: string, end: string)
    {
      this.id = id;
      this.client = client;
      this.job = job;
      this.start = start;
      this.end = end;
    }

    static getParentEventFrom(state: Array<jh.event>, id: number)
    {
      return state.find((e) => e.id === id) || nullEvent();
    }

    static getParentEvent(family: Array<jh.event>)
    {
      const parentId = family.at(0)?.id || 0;
      //return all events that has the same parentId
      return (
        family.find((e) => e.id === parentId && e.type === "roothead") ||
        nullEvent()
      );
    }

    static getClosestTail(family: Array<jh.event>, event: jh.event)
    {
      return (
        family
          .filter((e) => e.type === "tailhead")
          .map((tail) => {
            const distance = DateService.DaysFrom(tail.start, event.start);

            return { distance, tail };
          })
          .filter((tail) => tail.distance > 0)
          .sort((prev, next) => prev.distance - next.distance)
          .at(0)?.tail || nullEvent()
      );
      //return all events that has the same parentId
    }

    static isNull(event: jh.event)
    {
      return (
        !event.id && !event.client && !event.job && !event.start && !event.end
      );
    }

    static isChildren(event: jh.event): boolean
    {
      return event.type === "tailhead";
    }

    static isPlaceholder(event: jh.event): boolean
    {
      return event.type.includes("holder");
    }

    static isParent(event: jh.event): boolean
    {
      return !this.isChildren(event) && !this.isPlaceholder(event);
    }

    static getUnusedId()
    {
      const lastId = 100000;
      return lastId;
    }

    public static eventID(id: number, role: string, subcomponent = "")
    {
        return `event:${role}:${id}:${subcomponent}`;
    }

    static getIdParams(serializedId:string)
    {
        const tokens = serializedId.split(":")
        return {role: tokens[1], id: parseInt(tokens[2]), subcomponent: tokens[3]}

    }

    static hasMutable(e: jh.event): e is Required<jh.event>
    {
        return typeof e.mutable === "object";
    }

    static isDone(e: jh.event): boolean
    {
        if(e.done.toLowerCase() === "true")
        {
            return true;
        }
        if(e.done.toLowerCase() === "false")
        {
            return false;
        }
        
        return false;
    }

    /**
     * Computes the ocupation of an event from start to end or if the duration is longer than week from start to saturday
     * @param event jh.event
     * @param dayOff The limit day to schedule a job, saturday is the default, because we don't work on weekends
     * @returns The range of spread of an event until some target
     */
    static maxSpread(event: jh.event, dayOff?: DayWeek ): number
    {
        const maxDayAvailable = DateService.GetDateNextDay(event.start, 7);
        return Math.min(1 + DateService.DaysFrom(event.start, event.end), DateService.DaysFrom(event.start, maxDayAvailable));
    }
}
