import tw from "tailwind-styled-components";

export const TWapp = tw.div`
	select-none box-border font-roboto font-extra md:text-base sm:text-xs text-xs custombp:text-xs customtp:text-portrait scale-100 bg-slate-50
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
customtp:h-screen
customtp:bg-gradient-to-b
from-slate-100
via-slate-50
to-[rgba(241, 245, 249, 0.8)]
overflow-hidden
utility-smooth sticky sm:top-20 customtp:top-8 custombp:top-10
`;
export const TWboard = tw.div`
	grid gap-1 mt-1 xl:components-calendar sm:ml-2 mx-0 bg-white
`;
export const TWheader = tw.div`
	sticky z-50 top-0 bg-gradient-to-r from-slate-900 via-slate-50 to-slate-900 outline outline-slate-50 outline-4
`;

// Login Form
export const TWloginWrapper = tw.section`
flex justify-center items-center h-full w-full
`;

export const TWloginForm = tw.form`
flex flex-col relative mx-0 my-auto w-full max-w-md p-5 
`;

export const TWloginInput = tw.input`
max-w-full p-2 bg-yellow-50 text-orange-500 mb-4 rounded-md outline-none transition-shadow shadow-sm hover:shadow-md focus:shadow-md 
`;

export const TWloginButton = tw.button`
p-4 text-yellow-50 uppercase bg-orange-500 border-none rounded-md outline-none cursor-pointer mt-3 shadow-md transition-colors hover:bg-orange-700
`;

/*
import styled from "styled-components";




*/
