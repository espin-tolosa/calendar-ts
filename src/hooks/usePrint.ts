import { useEffect, useState } from "react";

export const usePrint = () => {
  //title="Double click here to print this month"
  const hPrint = () => {
    setToPrint((prev) => !prev);
  };

  const [toPrint, setToPrint] = useState(false);

  useEffect(() => {
    toPrint && window.print();
    toPrint && setToPrint(false);
  }, [toPrint]);

  return [toPrint, hPrint] as [typeof toPrint, typeof hPrint];
};
