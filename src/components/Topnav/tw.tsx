import tw from "tailwind-styled-components";

export const TWcontainer = tw.div`
	sm:font-extrabold sm:text-lg font-extrabold text-sm flex justify-between items-center
`;

export const TWlogo = tw.div`
	sm:ml-28 ml-2 overflow-visible whitespace-nowrap portrait:mr-2 text-white
`;

export const TWtitle = tw.div`
	overflow-hidden whitespace-nowrap text-ellipsis portrait:mr-2
`;

export const TWlogout = tw.button`
	text-white hover:text-black border-2 hover:bg-gray-50 my-0.5 mr-4 border-gray-50 hover:border-transparent rounded-full px-4 bg-transparent transition-colors
`;
