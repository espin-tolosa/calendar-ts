import { ReactChildren, ReactChild } from "react";

interface AuxProps {
  children: ReactChild | ReactChildren;
}

export const Styles_Headers_Month = ({ children }: AuxProps) => (
  <p className="text-4xl select-none font-bold text-gray-800 mb-8 bg-lime-200">
    {children}
  </p>
);
