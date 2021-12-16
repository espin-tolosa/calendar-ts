import { ReactChildren, ReactChild } from "react";

interface AuxProps {
  children: ReactChild | ReactChildren;
}

export const Styles_Headers_Day = ({ children }: AuxProps) => (
  <p className="w-12 h-full text-sm font-medium text-gray-800 uppercase">
    {children}
  </p>
);
