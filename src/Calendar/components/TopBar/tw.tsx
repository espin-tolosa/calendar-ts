import tw from "tailwind-styled-components";

export const TWcontainer = tw.div`bg-stone-900 font-normal flex justify-between items-center px-4 py-1 print:hidden`;

export const TWlogo = tw.div`overflow-visible whitespace-nowrap text-white flex flex-row gap-1`;

export const TWtitle = tw.div`overflow-hidden whitespace-nowrap text-ellipsis text-white`;

//interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//  title: string;
//}

export const TWlogout = tw.button`
	text-white hover:text-black border-[1px] hover:bg-slate-50 border-slate-50 hover:border-transparent rounded-full px-4 bg-transparent transition-colors
`;
