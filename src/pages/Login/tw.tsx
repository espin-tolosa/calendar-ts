import tw from "tailwind-styled-components";

export const TWloginWrapper = tw.section`
flex justify-center items-center h-full
`;

export const TWloginForm = tw.form`
flex flex-col relative mx-0 my-auto max-w-md p-5 
`;

export const TWloginInput = tw.input`
p-2 bg-yellow-50 text-orange-500 mb-4 rounded-md outline-none transition-shadow shadow-sm hover:shadow-md focus:shadow-md 
`;

export const TWloginButton = tw.button`
p-4 text-yellow-50 uppercase bg-orange-500 border-none rounded-md outline-none cursor-pointer mt-3 shadow-md transition-colors hover:bg-orange-600
`;
