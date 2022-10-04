import { FetchEvent } from "@/classes/fetchEvent";
import { useEffect } from "react";
import { useEventDispatch } from "../hooks/useEventsState";

export const dispatchAllFetchEvents = (fetcher = FetchEvent.instance()) => {

  const eventsDispatcher = useEventDispatch();
  
  const hFetchAll = async () => {
    const data = await fetcher.all()
    eventsDispatcher({type: "syncDB", payload: data});
  };

  useEffect(() => {
    hFetchAll();
  }, []);

};
