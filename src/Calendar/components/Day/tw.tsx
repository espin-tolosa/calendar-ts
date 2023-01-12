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

  export const GlobalStyle = tw.div<{
    $isLock: boolean;
    $isWeekend: boolean;
  }>`
	min-h-[15vh] transition-colors font-light shadow-[0px_0px_1px_rgb(226,232,240)] transition-all

	${({ $isLock }: { $isLock: boolean }) =>
    ($isLock && "bg-orange-400 cursor-not-allowed select-none") ||
    (!$isLock && "bg-white day cursor-pointer") ||
    ""}

	${({ $isWeekend }: { $isWeekend: boolean }) =>
    ($isWeekend &&
      "bg-slate-50 outline outline-[1px] outline-slate-100 select-none") ||
    (!$isWeekend && "outline outline-[1px] outline-slate-300") ||
    ""}	
    small_screen_w:text-xs
    small_screen_h:text-xs
	${() => toPrint}

`;

export const header = tw.div<{
    $isLock: boolean;
    $isWeekend: boolean;
  }>`
border-b-[1px] border-slate-200 day-header flex sm:justify-end justify-center bg-white

${({ $isLock }: { $isLock: boolean }) =>
  ($isLock && "bg-orange-400 z-Dayoff bg-opacity-50 select-none") || ""}	

${({ $isWeekend }: { $isWeekend: boolean }) =>
  ($isWeekend && "bg-slate-50 hover:bg-slate-50 select-none") ||
  (!$isWeekend && "") ||
  ""}	

${() => toPrint}
`;

  export const daySpot = tw.div<{ $isToday: boolean }>`
	flex justify-center items-center rounded-full bg-white w-5 h-5 mr-1 my-1
	${({ $isToday }: { $isToday: boolean }) =>
    ($isToday && "bg-blue-400 text-white") || ""}
	${() => toPrint}
`;

