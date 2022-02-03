import tw from "tailwind-styled-components";

export const TWflexContainer = tw.div`
  flex flex-col justify-start`;

export const TWtextContent = tw.div<{ $cells: number }>`
	absolute whitespace-nowrap overflow-hidden overflow-ellipsis pl-2 text-white rounded-full ml-[0.1rem]
	${({ $cells }) =>
    ($cells === 1 && "event-span-1") ||
    ($cells === 2 && "event-span-2") ||
    ($cells === 3 && "event-span-3") ||
    ($cells === 4 && "event-span-4") ||
    ($cells === 5 && "event-span-5") ||
    ($cells === 6 && "event-span-6") ||
    ($cells === 7 && "event-span-7") ||
    "extend-event-1"}
`;

export const TWextend = tw.div<{ $cells: number }>`
	absolute text-transparent	cursor-e-resize	min-w-[7.14%]	z-ExtendEvent
	${({ $cells }) =>
    ($cells === 1 && "extend-event-1") ||
    ($cells === 2 && "extend-event-2") ||
    ($cells === 3 && "extend-event-3") ||
    ($cells === 4 && "extend-event-4") ||
    ($cells === 5 && "extend-event-5") ||
    ($cells === 6 && "extend-event-6") ||
    ($cells === 7 && "extend-event-7") ||
    "extend-event-1"}
`;

export const TWplaceholder = tw.div`
	text-transparent my-0.5
`;
