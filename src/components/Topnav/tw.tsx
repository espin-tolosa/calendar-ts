import tw from "tailwind-styled-components";

export const container = tw.div`
	flex justify-between items-center font-extra
`;

export const logo = tw.div`
	sm:ml-28 ml-2 overflow-visible whitespace-nowrap portrait:mr-2
`;

export const title = tw.div`
	overflow-hidden whitespace-nowrap text-ellipsis portrait:mr-2
`;

export const logout = tw.button`
	border-2 hover:bg-transparent mr-4 border-gray-200 hover:border-gray-700 hover:text-black rounded-full px-4 bg-gray-200 text-gray-700 transition-colors active:bg-indigo-500
`;