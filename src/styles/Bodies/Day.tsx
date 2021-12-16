import { ReactChildren, ReactChild } from "react";

//Fix: interface-childs-array
interface AuxProps {
  children:
    | Array<ReactChild>
    | Array<ReactChildren>
    | ReactChild
    | ReactChildren;
}

export const Styles_Bodies_Day = ({ children }: AuxProps) => (
  <div className="flex items-start justify-start w-40 h-full pl-2 pr-32 pt-2.5 pb-24 border border-gray-200">
    <div className="text-sm font-medium text-green-900">{children}</div>
  </div>
);

export const Styles_Bodies_DayEnd = ({ children }: AuxProps) => (
  <div className="flex items-start justify-start w-40 h-full pl-2 pr-32 pt-2.5 pb-24 border border-gray-200">
    <p className="opacity-50 text-sm font-medium text-gray-800">{children}</p>
  </div>
);
