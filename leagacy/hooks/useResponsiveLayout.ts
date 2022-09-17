import { useEffect, useState } from "react";
const LARGE_WINDOW_SIZE = 640; /*px*/

export const useListenWindowSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const [windowSize, setWindowSize] = useState({ width, height });

  const windowObserver = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setWindowSize({ width, height });
  };

  //This event listener never unmounts but in any case I will keep the clean effect
  useEffect(() => {
    window.addEventListener("resize", windowObserver);
    return () => {
      window.removeEventListener("resize", windowObserver);
    };
  }, []);

  const isLargeWindow = windowSize.width > LARGE_WINDOW_SIZE;

  return isLargeWindow;
};
