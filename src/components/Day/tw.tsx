/* eslint no-use-before-define: 0 */ // --> OFF
import tw from "tailwind-styled-components";
// Print mode
const toPrint = "printable print:text-black print:bg-white";
/*
NOTE about day-off:

The case of a day that is not assignable to any event, because it's a day-off or something similar it is currently styled but hardcoded
Still there is a part of this feature that is not implemented and corresponds to the possibility to assign throw events in a day-off
this requires JS, hasta ahora solamente el CSS ha sido incorporado.
*/
// TopNav represents around  3vh
// Month header is around 2vh
// Max num of possible columns in a month is 6
// choosen min height = (100-3-2) / 6 ~= 15vh

export namespace styles {
  export const contain = tw.div<{
    $isLock: boolean;
    $isWeekend: boolean;
  }>`
	min-h-[15vh] transition-colors font-light shadow-[0px_0px_1px_rgb(226,232,240)]

	${({ $isLock }) =>
    ($isLock && "bg-orange-400 cursor-not-allowed select-none") ||
    (!$isLock && "bg-white day cursor-pointer") ||
    ""}

	${({ $isWeekend }) =>
    ($isWeekend &&
      "bg-slate-300 z-Dayoff outline outline-[1px] outline-slate-100 select-none") ||
    (!$isWeekend && "outline outline-[1px] outline-slate-300") ||
    ""}	


	${() => toPrint}

`;

  export const header = tw.div<{
    $isLock: boolean;
    $isWeekend: boolean;
  }>`
border-b-[1px] border-slate-200 day-header flex sm:justify-end justify-center bg-white

${({ $isLock }) =>
  ($isLock && "bg-orange-400 z-Dayoff bg-opacity-50 select-none") || ""}	

${({ $isWeekend }) =>
  ($isWeekend && "bg-slate-300 hover:bg-slate-50 select-none") ||
  (!$isWeekend && "") ||
  ""}	

${() => toPrint}

`;

  export const daySpot = tw.div<{ $isToday: boolean }>`
	flex justify-center items-center rounded-full bg-white w-7 h-7 custombp:w-5 custombp:h-5 customtp:w-5 customtp:h-5 sm:my-1 ml-1 mx-1
	${({ $isToday }) => ($isToday && "bg-blue-400 text-white") || ""}
	${() => toPrint}
`;
}
