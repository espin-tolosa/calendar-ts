import { useEffect, useRef } from "react";

export const useOnce = (callback: () => void, condition: boolean) => {
  const usedOnce = useRef(false);

  useEffect(() => {
    if (condition && !usedOnce.current) {
      callback();
      usedOnce.current = true;
    }
  }),
    [condition];
};
