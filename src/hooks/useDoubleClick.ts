import { useEffect, useState } from "react";

export const useDoubleClick = (doubleClick?: unknown) => {
  const [click, setClick] = useState(0);
  useEffect(() => {
    if (click === 1) {
      setTimeout(() => {
        setClick(0);
      }, 500);
    }
    //reset after doing the action asigned to double click
    if (click >= 2) {
      if (typeof doubleClick === "function") {
        doubleClick();
      }

      setClick(0);
    }
  }, [click]);

  return {
    onClick: () => {
      setClick((prev) => prev + 1);
    },
  };
};
