import tw from "tailwind-styled-components";

export const TWapp = tw.div`
	select-none box-border font-roboto font-extra md:text-xl sm:text-sm text-sm custombp:text-sm customtp:text-portrait scale-100 bg-slate-50
`;

export const TWmain = tw.div<{ $display: boolean }>`
${({ $display }) =>
  ($display && "components-controller-on") ||
  (!$display && "components-controller-off") ||
  ""}	
sm:grid sm:landscape:grid flex flex-col custombp:text-landscape
`;

// overflow: hidden;
// transition-property: max-height;
// transition-timing-function: ease-in-out;
// transition-duration: 0.3s;

export const TWcontroller = tw.div<{ $display: boolean }>`
${({ $display }) =>
  ($display && "max-h-[95vh] customtp:max-h-[38vh] custombp:max-h-[88vh]") ||
  (!$display && "max-h-0") ||
  ""}	
rounded-b-lg mt-1
customtp:h-screen
customtp:bg-gradient-to-b
customtp:from-slate-100
customtp:via-[rgba(241,245,249,0.8)]
customtp:to-transparent
overscroll-contain

overflow-hidden
transition-[max-height]
ease-in-out
duration-500

sticky sm:top-10 customtp:top-6 custombp:top-6 z-TopLayer

rounded-md
shadow-[shadow-[5px_5px_5px_rgb(148,163,184)]
`;
export const TWboard = tw.div`
grid gap-1 mt-1 xl:components-calendar sm:ml-2 mx-0 bg-white
`;
export const TWheader = tw.div`
sticky top-0 z-50
bg-slate-900 outline outline-white outline-4 overscroll-contain
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
