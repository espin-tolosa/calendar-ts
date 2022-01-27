import tw from "tailwind-styled-components";

export const TWapp = tw.div`
	select-none box-border font-roboto font-extra md:text-base sm:text-xs text-xs custombp:text-xs customtp:text-portrait
`;

export const TWmain = tw.div<{ $display: boolean }>`
${({ $display }) =>
  ($display && "components-controller-on") ||
  (!$display && "components-controller-off") ||
  ""}	
sm:grid sm:landscape:grid flex flex-col custombp:text-landscape
`;

export const TWcontroller = tw.div<{ $display: boolean }>`
${({ $display }) =>
  ($display && "utility-smooth-display-on") ||
  (!$display && "utility-smooth-display-off") ||
  ""}	
rounded-b-lg z-TopLayer mt-1
bg-gradient-to-b from-gray-100 via-gray-300 to-gray-400	
utility-smooth sticky sm:top-8 customtp:top-4 custombp:top-5
`;
export const TWboard = tw.div`
	grid gap-4 mt-1 xl:components-calendar sm:mx-4 mx-0 bg-white
`;
export const TWheader = tw.div`
	sticky z-TopLayer top-0 bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400
`;
