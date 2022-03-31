import tw from "tailwind-styled-components";

export const TWjobContent = tw.div<{ $isHover: boolean }>`
flex whitespace-normal break-words overflow-hidden overflow-ellipsis
`;

export const TWflexContainer = tw.div`
  flex flex-col justify-start my-1 transition-colors
	`;

export const TWtextContent = tw.div<{
  $cells: number;
  $isHover: boolean;
  $isChildren: boolean;
  $client: string;
}>`


flex flex-row gap-1 items-center absolute
whitespace-nowrap overflow-hidden overflow-ellipsis
active:text-black ml-[0.1rem] transition-colors
printable
${({ $client }) => $client}
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
		
rounded-r-[10px]
${({ $isChildren }) => (!$isChildren && "rounded-l-[10px]") || ""}
${({ $isHover, $isChildren }) =>
  ($isHover && !$isChildren && "text-black") ||
  ($isChildren && "text-transparent") ||
  ""}
`;

export const TWextend = tw.div<{ $cells: number }>`
	mt-[1px] absolute text-transparent extend-event min-w-[7.14%] z-ExtendEvent

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
