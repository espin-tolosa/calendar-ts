import { useEffect, useState } from "react";

export const usePrint = () => {
  //title="Double click here to print this month"
  const hPrint = () => {
    setToPrint((prev) => !prev);
  };

  const [toPrint, setToPrint] = useState(false);

  useEffect(() => {
    if (!toPrint) {
      return;
    }
    const isSupported = Object.prototype.hasOwnProperty.call(window, "print");

    if (!isSupported) {
      window.alert("Print to PDF isn't supported in this device jet");
      return;
    }
    window.print();
    setToPrint(false);
  }, [toPrint]);

  return [toPrint, hPrint] as [typeof toPrint, typeof hPrint];
};
