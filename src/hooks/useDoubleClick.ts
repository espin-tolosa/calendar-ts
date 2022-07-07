import { useEffect, useCallback, useState, useRef } from "react";

type DoubleClickCallback = () => void;

const RELAX_TIME = 500; //ms

const useClickState = () => {
  const [click, setClick] = useState(0);
  const reset = () => setClick(0);
  const next = () => setClick((prev) => prev + 1);
  const isOnState = (value: number) => click === value;
  return { click, isOnState, next, reset };
};

export const useDoubleClick = (
  callback: DoubleClickCallback,
  client?: string
): (() => void) => {
  const state = useClickState();
  const id = useRef<NodeJS.Timeout | null>(null);
  const stableCallback = useCallback(() => {
    console.log("memoizing callback", state, client);
    callback();
    state.reset();
  }, [callback]);
  useEffect(() => {
    //State 1: create a time to reset the state and the timer itself after the relaxation time
    if (state.isOnState(1)) {
      id.current = setTimeout(() => {
        id.current = null;
        state.reset();
      }, RELAX_TIME);
    }

    //State 2: call the callback and clear old timer created on state 1
    if (state.isOnState(2)) {
      stableCallback();

      //if older timers doesn't reset when action is commited then it will hit you later
      if (typeof id.current === "number") {
        window.clearTimeout(id.current);
        id.current = null;
      }
    }
  }, [state.click]);

  return state.next;
};
