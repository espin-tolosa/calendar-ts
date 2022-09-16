import { FetchEvent } from "@/classes/fetchEvent";
import { useEffect } from "react";
import { useEventDispatch } from "../hooks/useEventsState";

export const useGetAllEventsFrom = () => {

  const eventsDispatcher = useEventDispatch();
  
  const hFetchAll = async () => {
    const fetcher: FetchEvent = new FetchEvent();
    const data = await fetcher.all()
    eventsDispatcher({type: "syncDB", payload: data});
  };

  useEffect(() => {
    hFetchAll();
  }, []);

  return hFetchAll
};
