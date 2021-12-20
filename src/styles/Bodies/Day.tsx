import { ReactChildren, ReactChild } from "react";

//Fix: interface-childs-array
interface AuxProps {
  children: ReactChild | ReactChildren;
  date: string;
}

export const Styles_Bodies_Day = ({ children, date }: AuxProps) => (
  <div className="flex items-start justify-start w-40 h-full pl-2 pr-32 pt-2.5 pb-2.5 border border-gray-200">
    <div className="text-sm select-none font-medium text-green-900 min-h-[6rem]">
      {date}
      {children}
    </div>
  </div>
);

export const Styles_Bodies_DayEnd = ({ children, date }: AuxProps) => (
  <div className="flex items-start justify-start w-40 h-full pl-2 pr-32 pt-2.5 pb-2.5 border border-gray-200">
    <p className="text-sm select-none font-medium text-gray-400 min-h-[6rem]">
      {date}
      {children}
    </p>
  </div>
);
