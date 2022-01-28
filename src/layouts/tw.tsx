import tw from "tailwind-styled-components";

export const TWapp = tw.div`
	select-none box-border font-roboto font-extra md:text-base sm:text-xs text-xs custombp:text-xs customtp:text-portrait scale-100
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
bg-gradient-to-b from-gray-100 via-gray-300 to-gray-400	
utility-smooth sticky sm:top-8 customtp:top-4 custombp:top-5
`;
export const TWboard = tw.div`
	grid gap-4 mt-1 xl:components-calendar sm:mx-4 mx-0 bg-white
`;
export const TWheader = tw.div`
	sticky z-TopLayer top-0 bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400
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
