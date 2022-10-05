import tw from "tailwind-styled-components";

export const TWjobContent = tw.div<{$isHover: boolean;}>
`
${({ $isHover }: { $isHover: boolean }) => ($isHover && 'z-Dayoff') || ''}
flex whitespace-normal break-words overflow-hidden overflow-ellipsis`;

//I needed to create this component which is a copy of flexContainer just to change z-index and give its corresponding holder behavior
export const TWflexContainer_Holder = tw.div`flex flex-col justify-start transition-colors`;

export const TWflexContainer = tw.div`flex flex-col justify-start transition-colors`;

export const TWtextContent = tw.div<

{$cells: number; $isHover: boolean; $isChildren: boolean; $client: string;}

>`flex flex-row gap-1 items-center absolute whitespace-nowrap overflow-hidden overflow-ellipsis active:text-black ml-[0.1rem] transition-colors printable

${({ $client }: { $client: string }) => $client}
${({ $cells }: { $cells: number }) =>
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
${({ $isChildren }: { $isChildren: boolean }) =>
  (!$isChildren && "rounded-l-[10px]") || ""}
${({ $isHover, $isChildren }: { $isHover: boolean; $isChildren: boolean }) =>
  ($isHover && !$isChildren && "text-black") ||
  ($isChildren && "text-transparent") ||
  ""}
`;

export const TWtextArea = tw.span`
rounded-[5px] w-full p-1 caret-black focus:bg-green-50`;

export const TWextend = tw.div<
{ $cells: number }
>`
mt-[1px] absolute text-transparent extend-event-e min-w-[4.14%] z-ExtendEvent h-12

${({ $cells }: { $cells: number }) =>
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

export const TWextend_Left = tw.div<{ $cells: number }>`
	mt-[1px] absolute text-transparent extend-event-w min-w-[4.14%] z-ExtendEvent h-12
	${() =>
    import.meta.env.MODE === "development-none"
      ? "border-2 border-green-900"
      : ""}

	${({ $cells }: { $cells: number }) =>
    ($cells === 1 && "extend-event-l-1") ||
    ($cells === 2 && "extend-event-l-2") ||
    ($cells === 3 && "extend-event-l-3") ||
    ($cells === 4 && "extend-event-l-4") ||
    ($cells === 5 && "extend-event-l-5") ||
    ($cells === 6 && "extend-event-l-6") ||
    ($cells === 7 && "extend-event-l-7") ||
    ($cells === 8 && "extend-event-l-8") ||
    "extend-event-l-1"}
`;

export const TWplaceholder = tw.div``;

export const TWStyledSelect = tw.select`border-none py-px padding-x-clamp button-shadow text-effect rounded-sm cursor-pointer outline-none text-white`;

export const TWStyledNonSelect = tw.div`border-none py-px padding-x-clamp button-shadow text-effect rounded-sm outline-none text-white `;

export const TWStyledCheckboxSelect = tw.div`border-none py-px padding-x-clamp button-shadow text-effect rounded-sm outline-none text-white flex flex-row justify-between`;