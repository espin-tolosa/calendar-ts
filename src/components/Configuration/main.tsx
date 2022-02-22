import React, { useEffect, useRef, useState } from "react";
import * as tw_Controller from "./tw";

import tw from "tailwind-styled-components/dist/tailwind";

export function Configuration() {
  const [columns, setColumns] = useState(1);
  const [boundError, setBoundError] = useState("");

  const screenWidth = useRef(window.screen.width); // TODO: use Observer in the future

  useEffect(() => {
    const controller = window.document.getElementById("Controller")!;
    console.log("Controller", controller.clientWidth);
    const computedWidth = columns;
    console.log("Computed width", computedWidth);
    document.documentElement.style.setProperty(
      "--calendar_columns",
      `${computedWidth}`
    );
    if (columns < 3) {
      let scrollTarget = "AutoScrollTarget_OnlyOneUniqueId";
      setTimeout(() => {
        handleScroll(scrollTarget);
      }, 0);

      const handleScroll = (target: string) => {
        const top = document.getElementById(target);
        top &&
          top.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "start",
          });
      };

      setBoundError("");
    } else {
      window.scrollTo(0, 16);
    }
  }, [columns]);

  const hChangeColumns = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onChangeColumValue = parseInt(e.target.value);
    if (onChangeColumValue > 0 && onChangeColumValue < 5) {
      setColumns(onChangeColumValue);
      //
    } else {
      setBoundError("Layout accepts maximum of 4 columns");
      setTimeout(() => {
        setBoundError("");
      }, 2000);
    }
  };
  const hSubcolumn = () => {
    const onChangeColumValue = columns - 1;
    if (onChangeColumValue > 0 && onChangeColumValue < 5) {
      setColumns(onChangeColumValue);
      //
    } else {
      setBoundError("Layout accepts maximum of 4 columns");
      setTimeout(() => {
        setBoundError("");
      }, 2000);
    }
  };

  const hAddcolumn = () => {
    const onChangeColumValue = columns + 1;
    if (onChangeColumValue > 0 && onChangeColumValue < 5) {
      setColumns(onChangeColumValue);
      //
    } else {
      setBoundError("Layout accepts maximum of 4 columns");
      setTimeout(() => {
        setBoundError("");
      }, 2000);
    }
  };

  if (screenWidth.current < 720) {
    return <></>;
  }

  return (
    <>
      <tw_Controller.form>
        <div className="grid grid-cols-2 gap-2">
          <div>Columns</div>
          <div className="flex flex-row justify-center text-xl ">
            <TW_button
              type="button"
              className="rounded-l-full"
              $display={columns > 1}
              onClick={hSubcolumn as any}
            >
              -
            </TW_button>
            <div className="bg-slate-200 w-10 text-center">{columns}</div>

            <TW_button
              className="rounded-r-full"
              $display={columns < 4}
              type="button"
              onClick={hAddcolumn as any}
            >
              +
            </TW_button>
          </div>
        </div>
        <div className="text-xs text-red-900 ">{boundError}</div>
      </tw_Controller.form>
    </>
  );
}

const TW_button = tw.button<{ $display: boolean }>`
                 w-8 hover:bg-slate-400 transition-colors

  ${({ $display }) =>
    ($display && "bg-slate-200") ||
    (!$display && "text-slate-400 bg-slate-100 ") ||
    ""}
`;
