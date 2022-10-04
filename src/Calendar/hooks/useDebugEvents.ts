import { useEventState } from "./useEventsState";
import { useEffect } from "react";

if(import.meta.env.PROD)
{
    throw Error(`useDebugEvent shouldn't be used in production because it provides public access to internal state of React, please remove any import call to this file in the entire project before running a build for production`);
}

declare global {
    interface Window {
        Debug: Record<string, unknown | undefined> | undefined;
    }
}

export function useDebugEvent()
{
    const events = useEventState();

    useEffect(() => {
        window.Debug = {};
        window.Debug.EventState = function () {
          events.forEach((e) => {
            console.log(e.mutable);
          });
        };
        return () => {
          if (window.Debug === undefined) {
            return;
          }
          window.Debug.EventState = undefined;
          window.Debug = undefined;
        };
      }, [events]);
}