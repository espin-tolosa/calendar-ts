import tw from "tailwind-styled-components";
/*
NOTE about day-off:

The case of a day that is not assignable to any event, because it's a day-off or something similar it is currently styled but hardcoded
Still there is a part of this feature that is not implemented and corresponds to the possibility to assign throw events in a day-off
this requires JS, hasta ahora solamente el CSS ha sido incorporado.
*/
export const TWsizedContainer = tw.div<{
  $isLock: boolean;
  $isSelected: boolean;
  $isWeekend: boolean;
  $showWeekend: boolean;
  $restDays: boolean;
}>`
	landscape:min-h-[17vh] portrait:min-h-[8vh] transition-colors
	font-light
 	shadow-[0px_0px_1px_rgb(226,232,240)]

	${({ $isLock }) =>
    ($isLock && "bg-slate-300 z-Dayoff cursor-not-allowed ") ||
    (!$isLock && "bg-white day active:bg-green-200 cursor-pointer") ||
    ""}	
	${({ $isSelected }) =>
    ($isSelected && "border-2 bg-green-100") || (!$isSelected && "") || ""}	

	${({ $isWeekend, $showWeekend }) =>
    ($isWeekend &&
      !$showWeekend &&
      "bg-slate-300 outline outline-[1px] outline-slate-100 ") ||
    (!$isWeekend && "outline outline-[1px] outline-slate-300 ") ||
    ""}	

	${({ $isWeekend, $showWeekend }) =>
    ($isWeekend && !$showWeekend && "z-Dayoff") || ""}	

		${({ $restDays }) => ($restDays && "bg-slate-50 z-Dayoff text-slate-50") || ""}

`;

export const TWheader = tw.div<{
  $isLock: boolean;
  $isWeekend: boolean;
  $showWeekend: boolean;
  $restDays: boolean;
}>`
border-b-[1px] border-slate-200 day-header flex sm:justify-end justify-center bg-white
	
	${({ $isLock }) => ($isLock && "bg-slate-300 z-Dayoff bg-opacity-50 ") || ""}	

	${({ $isWeekend, $showWeekend }) =>
    ($isWeekend && !$showWeekend && "bg-slate-300 hover:bg-slate-50 ") ||
    (!$isWeekend && "") ||
    ""}	

	${({ $restDays }) => ($restDays && "bg-slate-50 z-Dayoff text-slate-50") || ""}
	`;

export const TWdaySpot = tw.div<{ $isToday: boolean }>`
flex justify-center items-center rounded-full bg-white w-7 h-7 custombp:w-5 custombp:h-5 customtp:w-5 customtp:h-5 sm:my-1 ml-1 mx-1
${({ $isToday }) => ($isToday && "bg-blue-400 text-white") || ""}
	
	`;
