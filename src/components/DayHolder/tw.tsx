import tw from "tailwind-styled-components";
/*
NOTE about day-off:

The case of a day that is not assignable to any event, because it's a day-off or something similar it is currently styled but hardcoded
Still there is a part of this feature that is not implemented and corresponds to the possibility to assign throw events in a day-off
this requires JS, hasta ahora solamente el CSS ha sido incorporado.
*/
export const TWsizedContainer = tw.div`
bg-slate-100
	landscape:min-h-[17vh] portrait:min-h-[8vh] transition-colors
	font-light
 	shadow-[0px_0px_1px_rgb(226,232,240)]	
	z-Dayoff
	outline
	outline-1
outline-slate-100
`;
