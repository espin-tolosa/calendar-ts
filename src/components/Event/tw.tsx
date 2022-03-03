import tw from "tailwind-styled-components";

export const TWflexContainer = tw.div`
  flex flex-col justify-start my-1 transition-colors
	`;

export const TWtextContent = tw.div<{
  $cells: number;
  $justThrown: boolean;
  $clientTheme?: { color: string };
}>`
	absolute whitespace-nowrap overflow-hidden overflow-ellipsis pl-2 text-white active:text-black rounded-l-full ml-[0.1rem] transition-colors
	${({ $cells }) =>
    ($cells === 1 && "event-span-1") ||
    ($cells === 2 && "event-span-2") ||
    ($cells === 3 && "event-span-3") ||
    ($cells === 4 && "event-span-4") ||
    ($cells === 5 && "event-span-5") ||
    ($cells === 6 && "event-span-6") ||
    ($cells === 7 && "event-span-7") ||
    ($cells === 8 && "event-span-8") ||
    "extend-event-1"}
		
	${({ $justThrown, $clientTheme }) =>
    ($justThrown && "text-slate-400 bg-slate-200") ||
    $clientTheme?.color ||
    "bg-red-200"}

	${({ $cells }) => ($cells <= 7 && "rounded-r-full") || "rounded-r-none"}
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
    ($cells === 8 && "extend-event-8") ||
    "extend-event-1"}
`;

export const TWplaceholder = tw.div`
	text-transparent
`;
