import tw from "tailwind-styled-components";
/*
NOTE about day-off:

The case of a day that is not assignable to any event, because it's a day-off or something similar it is currently styled but hardcoded
Still there is a part of this feature that is not implemented and corresponds to the possibility to assign throw events in a day-off
this requires JS, hasta ahora solamente el CSS ha sido incorporado.
*/
export const TWsizedContainer = tw.div<{ $top: boolean; $isSelected: boolean }>`
	landscape:min-h-[15vh] portrait:min-h-[8vh] transition-colors
	font-light
 	shadow-[0px_0px_1px_rgb(226,232,240)]

	${({ $top }) =>
    ($top && "bg-slate-100 z-Dayoff bg-opacity-50 cursor-not-allowed ") ||
    (!$top && "bg-white day active:bg-green-200 cursor-pointer") ||
    ""}	
	${({ $isSelected }) =>
    ($isSelected && "border-2 bg-green-100") || (!$isSelected && "") || ""}	

`;

export const TWheader = tw.div`
border-b-[1px] border-slate-200 day-header flex sm:justify-start justify-center bg-white`;

export const TWdaySpot = tw.div`
	flex justify-center items-center w-[1.6rem] customtp:w-[1rem] rounded-full bg-white custombp:p-0 sm:my-1 customtp:my-0 custombp:my-0 ml-1 mx-1`;
