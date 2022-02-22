import { useState, useEffect } from "react";
import { useAutoScroll } from "@/hooks/useAutoScroll";

const MAX_COLUMS = 4;
const LARGE_WINDOW_SIZE = 1280; /*px*/
const ROOT_TARGET = "--calendar_columns";
const PREV_MONTHS = 2; //months rendered before present month

export const useConfigColumns = () => {
  const [columns, setColumns] = useState(1);
  const [boundError, setBoundError] = useState("");

  const scrollTarget = useAutoScroll();
  useEffect(() => {
    document.documentElement.style.setProperty(ROOT_TARGET, `${columns}`);

    if (columns <= PREV_MONTHS) {
      setTimeout(() => {
        handleScroll(scrollTarget);
      }, 200);

      const handleScroll = (target: string) => {
        const top = document.getElementById(target)!;
        top && //This is the same code as useAutoScroll
          top.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "start",
          });
      };
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [columns]);

  // handle on change columns via setColumns and also setError
  const hChangeColumns = (add: number) => {
    const nextValue = columns + add;
    if (nextValue > 0 && nextValue <= MAX_COLUMS) {
      setColumns(nextValue);
    } else {
      setBoundError("Layout accepts maximum of 4 columns");
      setTimeout(() => {
        setBoundError("");
      }, 2200);
    }
  };
  return [columns, boundError, hChangeColumns] as [
    number,
    string,
    typeof hChangeColumns
  ];
};

//////////////////////////////////////////////////////////////////////////
// Listen resize screen

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

/////////////////////////////////////////////////////////////////////////
// Set bound error
const useErrorMessage = () => {};
