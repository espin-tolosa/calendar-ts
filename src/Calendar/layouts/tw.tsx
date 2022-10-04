import tw from "tailwind-styled-components";

export const TWapp = tw.div`select-none box-border font-roboto font-normal text-sm scale-100 bg-slate-50 custom `;

export const TWmain = tw.div`flex flex-col`;

export const TWboard = tw.div`grid gap-1 xl:components-calendar bg-white print:w-full print:px-10`;

export const TWheader = tw.div`sticky top-0 z-TopLayer outline outline-white outline-4 overscroll-contain`;

// Login Form
export const TWloginWrapper = tw.section`flex justify-center items-center h-full w-full`;

export const TWloginForm = tw.form`flex flex-col relative mx-0 my-auto w-full max-w-md p-5`;

export const TWloginInput = tw.input`
max-w-full p-2 bg-yellow-50 text-orange-500 mb-4 rounded-md outline-none transition-shadow shadow-sm hover:shadow-md focus:shadow-md 
`;

export const TWloginButton = tw.button`
p-4 text-yellow-50 uppercase bg-orange-500 border-none rounded-md outline-none cursor-pointer mt-3 shadow-md transition-colors hover:bg-orange-700
`;

/*
import styled from "styled-components";




*/
