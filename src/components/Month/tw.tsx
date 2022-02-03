import tw from "tailwind-styled-components";

// This integrates the header and the board of a month
export const TWflexColLayout = tw.div`
flex flex-col justify-start
bg-white
shadow-[5px_5px_5px_rgb(148,163,184)]
rounded-md 
`;

// The header displays a text as: month year, like February 2022
export const TWheader = tw.div`
flex justify-center
font-medium
text-black
px-[2ch] border-b-2 border-slate-200 
bg-gradient-to-r from-slate-200 via-slate-50 to-slate-200
rounded-t-md
`;

// The gridBoard forces to display the days in a grid of 7xN being N in range: [4,5]
// Demo, how many rows could take a month, requires to take know how many cell days needs a month
// taken into account that any month could be start shifted any number of days in a week.
// min_length: shortest month (28 days) starting at very begining of the week (monday)
// max_length: longest month (31 days) starting at very end of the week (sunday)
// [mon + 28, sun + 31 ] = [28,30] cell days
// this means that N can take values of [4,5]
export const TWdaysBoard = tw.div`
	grid grid-cols-7 overflow-hidden relative bg-slate-300 gap-[1px] border-b-[1px] border-slate-300
`;

// Shifts the day where a month starts
export const TWdayShift = tw.div<{ $weekday: string }>`

${({ $weekday }) =>
  ($weekday === "mon" && "month-start-mon") ||
  ($weekday === "tue" && "month-start-tue") ||
  ($weekday === "wed" && "month-start-wed") ||
  ($weekday === "thu" && "month-start-thu") ||
  ($weekday === "fri" && "month-start-fri") ||
  ($weekday === "sat" && "month-start-sat") ||
  ($weekday === "sun" && "month-start-sun") ||
  ""}
`;
