import { useCtxCurrentMonthRef } from "@/globalStorage/currentMonthReference";
import { DOMRefs } from "@/globalStorage/DOMRefs";
import { useState, useEffect } from "react";

const MAX_COLUMS = 4;
const INIT_COLUMNS = 1;
const ROOT_TARGET = "--calendar_columns";
const CLEAR_ERROR_MESSAGE = "";
const CLEAR_ERROR_TIME = 2200; /*ms*/
const SECOND_SCROLL = 1000; /*ms*/ //sometimes scrollIntoView doesn't reach the target position, so I apply a little delay doing as second scroll

export const useScrollToCurrentMonth = () => {
  //
  const [columns, setColumns] = useState(INIT_COLUMNS);
  //
  const [errorMessage, setErrorMessage] = useState(CLEAR_ERROR_MESSAGE);
  //
  const monthRef = useCtxCurrentMonthRef();
  //
  const references = DOMRefs.useState();
  //
  const hSmoothScroll = () => {
    //monthRef?.current?.scrollIntoView({ behavior: "smooth" })!;
    //setTimeout(() => {
    //  monthRef?.current?.scrollIntoView()!;
    //}, SECOND_SCROLL);
  };

  // SMOOTH SCROLL
  useEffect(() => {
    console.log("DOMRefs state viewed from Config panel", references);
    const topNavRef = references.find((ref) => ref?.current?.id === "Topnav");
    const currentMonth = references.find(
      (ref) => ref?.current?.id === "Current-Month"
    );
    if (topNavRef && currentMonth) {
      console.log("Able to scroll");
      //hSmoothScroll();
    }
    //    document.documentElement.style.setProperty(ROOT_TARGET, `${columns}`);
  }, [columns, references]);
  //

  // handle on change columns via setColumns and also setError
  //Currying setState with toAdd parameter captured in a lambda
  const addColumns = (toAdd: number) => {
    setColumns((current) => {
      const nextColumnsState = current + toAdd;
      if (1 <= nextColumnsState && nextColumnsState <= MAX_COLUMS) {
        return nextColumnsState;
      } else {
        setTemporalMessages(
          setErrorMessage,
          `Layout accepts maximum of ${MAX_COLUMS} columns`
        );
        return current;
      }
    });
  };
  return [columns, errorMessage, addColumns] as [
    number,
    string,
    (add: number) => void
  ];
};

// This function is a easy way to set and unset string states in components that won't unmount never
// if the component could be potentially unmounted during the duration of this process it shouldn't
// be used, otherwise will create memory leaks. In that case you will need useRef and useEffect
// TODO: perform is component mount before defered set to clear
type setValue = React.Dispatch<React.SetStateAction<string>>;
function setTemporalMessages(setter: setValue, value: string) {
  setter(() => {
    setTimeout(() => {
      setter(CLEAR_ERROR_MESSAGE);
    }, CLEAR_ERROR_TIME);
    return value;
  });
}

//////////////////////////////////////////////////////////////////////////
// Listen resize screen
