import tw from "tailwind-styled-components";

export const form = tw.form`
	flex flex-col gap-2 sm:px-4 custombp:px-1 px-1 bg-slate-50 mt-4
`;

export const button = tw.input<{ $display: boolean }>`
	bg-white border-none p-1 rounded-full cursor-pointer font-extra button-shadow

  ${({ $display }) => ($display && "") || (!$display && "hidden") || ""}
`;

export const startEnd = tw.div`
	grid grid-cols-2 gap-2
`;

export const date = tw.input`
	text-center button-shadow text-effect rounded-sm
`;

export const job = tw.input`
  border-none py-px padding-x-clamp button-shadow text-effect rounded-sm
`;

export const description_wrap = tw.div`
	grow-wrap
`;

export const description = tw.textarea`
	button-shadow rounded-sm
`;
