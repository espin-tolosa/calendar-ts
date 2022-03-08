import { useState, useEffect } from "react";
import { useAutoScroll } from "@/hooks/useAutoScroll";

const MAX_COLUMS = 4;
const ROOT_TARGET = "--calendar_columns";
const PREV_MONTHS = 2; //months rendered before present month

export const useConfigColumns = () => {
  const [columns, setColumns] = useState(1);
  const [boundError, setBoundError] = useState("");

  const scrollTarget = useAutoScroll();
  const hSmoothScroll = () => {
    const top = document.getElementById(scrollTarget)!;
    console.log("Scroll to", scrollTarget);
    top && //This is the same code as useAutoScroll
      top.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
  };
  useEffect(() => {
    document.documentElement.style.setProperty(ROOT_TARGET, `${columns}`);

    if (columns <= PREV_MONTHS) {
      document.addEventListener("DOMContentLoaded", hSmoothScroll);
      setTimeout(() => {
        hSmoothScroll();
      }, 200);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return () => {
      document.removeEventListener("DOMContentLoaded", hSmoothScroll);
    };
  }, [columns]);

  // handle on change columns via setColumns and also setError
  const hChangeColumns = (add: number) => {
    const nextValue = columns + add;
    if (0 < nextValue && nextValue < MAX_COLUMS + 1) {
      setColumns(nextValue);
    } else {
      setTemporalMessages(setBoundError, "Layout accepts maximum of 4 columns");
    }
  };
  return [columns, boundError, hChangeColumns] as [
    number,
    string,
    typeof hChangeColumns
  ];
};

const handleScroll = () => {};

// This function is a easy way to set and unset string states in components that won't unmount never
// if the component could be potentially unmounted during the duration of this process it shouldn't
// be used, otherwise will create memory leaks. In that case you will need useRef and useEffect
type setValue = React.Dispatch<React.SetStateAction<string>>;
function setTemporalMessages(
  setter: setValue,
  value: string,
  delay: number = 2200
) {
  setter(value);
  setTimeout(() => {
    setter("");
  }, delay);
}

//////////////////////////////////////////////////////////////////////////
// Listen resize screen
