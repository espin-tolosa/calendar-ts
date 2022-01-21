import tw from "tailwind-styled-components";
/*
NOTE about day-off:

The case of a day that is not assignable to any event, because it's a day-off or something similar it is currently styled but hardcoded
Still there is a part of this feature that is not implemented and corresponds to the possibility to assign throw events in a day-off
this requires JS, hasta ahora solamente el CSS ha sido incorporado.
*/

export const TW_header = tw.div`
day-header
flex
justify-start
bg-gray-100
px-[1ch]
py-px

border-y-2
border-b-gray-300
`;

export const TW_container = tw.div<{ top: boolean }>`

landscape:min-h-[18vh]
portrait:min-h-[8vh]
transition-colors
outline-1
outline-slate-100

border-x-gray-200
border-x-2
border-b-2



${({ top }) =>
  (top && "z-Dayoff bg-gray-200  bg-opacity-50 active:bg-gray-200 ") ||
  "day bg-white active:bg-green-200"}
	`;

import { Date, Children } from "@/interfaces";

type AuxProps = Children & { date: Date };

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
