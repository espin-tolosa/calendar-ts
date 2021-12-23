import { ReactChildren, ReactChild, ReactNode, FunctionComponent } from "react";

//Fix: interface-childs-array
interface AuxProps {
  children: ReactChild | ReactChildren;
  date: string;
}

export const Styles_Bodies_Day = ({ children, date }: AuxProps) => (
  <div className="flex items-start justify-start w-40 h-full pl-2 pr-32 pt-2.5 pb-2.5 border border-gray-200">
    <div className="text-sm select-none font-medium text-green-900 min-h-[6rem] box">
      {date}
      {children}
    </div>
  </div>
);

export const Styles_Bodies_DayEnd = ({ children, date }: AuxProps) => (
  <div className="flex items-start justify-start w-40 h-full pl-2 pr-32 pt-2.5 pb-2.5 border border-gray-200">
    <p className="text-sm select-none font-medium text-palette-lm min-h-[6rem]">
      {date}
      {children}
    </p>
  </div>
);
interface DayHeader {
  dayname: string;
  children: ReactNode;
}
// INFO: It contains the first row of a month with the named days of the week in a expected format as:
// MONDAY			| TUESDAY			| WEDNESDAY			| THURSDAY			| FRIDAY			| SATURDAY			| SUNDAY
//export const Styles_Headers_Day: React.FC<DayHeader> = ({dayname, children}) => {
//  <p className="w-12 h-full text-sm select-none font-medium text-gray-800 uppercase">
//    {date}
//  </p>;
//};
interface WeekDayProps {
  day: string;
}
export function WeekDay({ day }: WeekDayProps) {
  return (
    <div className="w-12 h-full text-sm select-none font-medium text-gray-800 uppercase">
      {day}
    </div>
  );
}

//export const Styles_Headers_Day:FunctionComponent<FadeInSectionProps> = ({offset, children}) => {
//  <p className="w-12 h-full text-sm select-none font-medium text-gray-800 uppercase">
//    {offset}
//  </p>;
///};
