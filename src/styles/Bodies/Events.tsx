import { ReactChildren, ReactChild } from "react";

//Fix: interface-childs-array
interface AuxProps {
  children: ReactChild | ReactChildren;
}

export const Styles_Bodies_Event = ({ children }: AuxProps) => (
  <div className="text-sm  font-medium text-green-900 bg-red-100 px-8 my-2">
    {children}
  </div>
);
