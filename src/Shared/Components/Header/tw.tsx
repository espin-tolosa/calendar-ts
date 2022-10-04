import tw from "tailwind-styled-components";

/**
 * sticky top-0 z-TopLayer outline outline-white outline-4 overscroll-contain
 */
export const header = tw.div`
sticky top-0 z-TopLayer outline outline-white outline-4 overscroll-contain
`;

/**
 * bg-stone-900 font-normal flex justify-between items-center px-4 py-1 print:hidden
 */
export const container = tw.div`
bg-stone-900 font-normal flex justify-between items-center px-4 py-1 print:hidden
`;

/**
 * overflow-visible whitespace-nowrap text-white
 */
export const logo = tw.div`
overflow-visible whitespace-nowrap text-white
`;

/**
 * overflow-hidden whitespace-nowrap text-ellipsis text-white
 */
export const title = tw.div`
overflow-hidden whitespace-nowrap text-ellipsis text-white
`;

/**
 * text-white hover:text-black border-[1px] hover:bg-slate-50 border-slate-50 hover:border-transparent rounded-full px-4 bg-transparent transition-colors
 */
export const logout = tw.button`
text-white hover:text-black border-[1px] hover:bg-slate-50 border-slate-50 hover:border-transparent rounded-full px-4 bg-transparent transition-colors
`;
