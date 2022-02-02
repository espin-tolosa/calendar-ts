import tw from "tailwind-styled-components";
/*
NOTE about day-off:

The case of a day that is not assignable to any event, because it's a day-off or something similar it is currently styled but hardcoded
Still there is a part of this feature that is not implemented and corresponds to the possibility to assign throw events in a day-off
this requires JS, hasta ahora solamente el CSS ha sido incorporado.
*/
export const TWsizedContainer = tw.div<{ $top: boolean }>`
	landscape:min-h-[15vh] portrait:min-h-[8vh] transition-colors outline-1 outline-slate-100

	${({ $top }) =>
    ($top && "bg-gray-100 z-Dayoff bg-opacity-50 cursor-not-allowed ") ||
    (!$top && "bg-white day active:bg-green-200 cursor-pointer") ||
    ""}	
`;

export const TWheader = tw.div`
	font-light text-sm border-y-current day-header flex sm:justify-start justify-center bg-gray-100`;

export const TWdaySpot = tw.div`
	font-light text-sm flex justify-center items-center w-[1.6rem] rounded-full bg-white m-1`;
