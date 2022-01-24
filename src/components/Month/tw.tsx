import tw from "tailwind-styled-components";

// This integrates the header and the board of a month
export const flexColLayout = tw.div`
flex flex-col justify-center
bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100
shadow-[10px_10px_15px_rgba(0,0,0,0.3)]
rounded-md 
`;

// The header displays a text as: month year, like February 2022
export const header = tw.div`
flex justify-center
font-medium
px-[2ch] border-b-4 border-gray-400 
bg-gray-300
rounded-md 
`;

// The gridBoard forces to display the days in a grid of 7xN being N in range: [4,5]
// Demo, how many rows could take a month, requires to take know how many cell days needs a month
// taken into account that any month could be start shifted any number of days in a week.
// min_length: shortest month (28 days) starting at very begining of the week (monday)
// max_length: longest month (31 days) starting at very end of the week (sunday)
// [mon + 28, sun + 31 ] = [28,30] cell days
// this means that N can take values of [4,5]
export const daysBoard = tw.div`
	grid grid-cols-7 overflow-hidden relative last:bg-gray-300 border-b-4 border-b-gray-200 border-x-4
`;

// Shifts the day where a month starts
export const dayShift = tw.div<{ $weekday: string }>`

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
