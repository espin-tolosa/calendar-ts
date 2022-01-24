import tw from "tailwind-styled-components";

export const form = tw.form`
	flex flex-col gap-2 sm:px-4 custombp:px-1 px-1
`;

export const button = tw.input`
	bg-white border-none p-1 rounded-full cursor-pointer mt-2 font-extra button-shadow
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
