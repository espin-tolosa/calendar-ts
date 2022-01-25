import tw from "tailwind-styled-components";
/*
NOTE about day-off:

The case of a day that is not assignable to any event, because it's a day-off or something similar it is currently styled but hardcoded
Still there is a part of this feature that is not implemented and corresponds to the possibility to assign throw events in a day-off
this requires JS, hasta ahora solamente el CSS ha sido incorporado.
*/
export const sizedContainer = tw.div<{ $top: boolean }>`
	landscape:min-h-[18vh] portrait:min-h-[8vh] transition-colors outline-1 outline-slate-100 border-x-gray-200 border-x-2 border-b-2

	${({ $top }) =>
    ($top && "bg-gray-300 z-Dayoff bg-opacity-50 active:bg-gray-300 ") ||
    (!$top && "bg-white day active:bg-green-200") ||
    ""}	
`;

export const header = tw.div`
	day-header flex justify-start bg-gray-100 px-[1ch] py-px border-y-2 border-b-gray-300`;

export const daySpot = tw.div`
	flex justify-center items-center px-4 w-[1.6rem] rounded-full bg-gray-200`;
