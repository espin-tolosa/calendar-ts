import { ReactChildren, ReactChild } from "react";

interface AuxProps {
  children: Array<ReactChild> | Array<ReactChildren>;
}

export const Styles_Headers_Board_Row = ({ children }: AuxProps) => (
  <div className="inline-flex items-center justify-start w-full h-full bg-palette-rm">
    {children}
  </div>
);
