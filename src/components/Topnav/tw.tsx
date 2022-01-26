import tw from "tailwind-styled-components";

export const TWcontainer = tw.div`
	flex justify-between items-center font-extra
`;

export const TWlogo = tw.div`
	sm:ml-28 ml-2 overflow-visible whitespace-nowrap portrait:mr-2
`;

export const TWtitle = tw.div`
	overflow-hidden whitespace-nowrap text-ellipsis portrait:mr-2
`;

export const TWlogout = tw.button`
	border-2 hover:bg-transparent mr-4 border-gray-200 hover:border-gray-700 hover:text-black rounded-full px-4 bg-gray-200 text-gray-700 transition-colors active:bg-indigo-500
`;
