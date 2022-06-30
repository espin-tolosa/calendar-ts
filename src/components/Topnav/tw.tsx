import tw from "tailwind-styled-components";

export const TWcontainer = tw.div`
	bg-slate-900 font-normal sm:text-lg custombp:text-xs customtp:text-xs flex justify-between items-center
	print:hidden
`;

export const TWlogo = tw.div`
	sm:ml-28 ml-2 overflow-visible whitespace-nowrap portrait:mr-2 text-white
`;

export const TWtitle = tw.div`
	overflow-hidden whitespace-nowrap text-ellipsis portrait:mr-2 text-white
`;

//interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//  title: string;
//}

export const TWlogout = tw.button`
	text-white hover:text-black border-[1px] hover:bg-slate-50 my-0.5 mr-4 border-slate-50 hover:border-transparent rounded-full px-4 bg-transparent transition-colors
`;
