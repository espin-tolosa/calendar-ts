import tw from "tailwind-styled-components";
/*
.day-header {
	display: flex;
  justify-content: right;
  background: hsl(0, 0%, 99%);
  padding: 1px 1ch 1px 1px;
  margin-bottom: 0.5em;
  transition: background 0.1s ease-in-out;
  outline: 1px solid lightgray;
}
*/

export const TW_header = tw.div`
day-header
text-right
bg-gray-100
px-[1ch]
py-px
font-medium

border-y-2
border-b-gray-300
`;

//outline-1
//outline
//outline-gray-200
/*
.day {
	min-height: calc(90vh / 10);
	transition: background 0.1s ease-in-out;
	outline: 1px solid lightgray;
	border: 1px solid lightgray;
}
.day:hover {
	background: hsl(0, 0%, 93%);
	outline: 1px solid lightgray;
}
.day:active {
	background: hsl(100, 60%, 70%);
}

.day:hover .day-header,
.day.hover .day-header {
	background: darkgray;
}
*/
export const TW_container = tw.div`
day

min-h-[9vh]
transition-colors
outline-1
outline-slate-100
hover:bg-gray-300
bg-white
active:bg-green-200
border-x-gray-200
border-x-2
border-b-2
	`;

/*
.day-header {
	display: flex;
	justify-content: right;
	background: hsl(0, 0%, 99%);

	padding: 1px 1ch 1px 1px;
	margin-bottom: 0.5em;
	transition: background 0.1s ease-in-out;
	outline: 1px solid lightgray;
}
.day {
  min-height: calc(90vh / 10);
  transition: background 0.1s ease-in-out;
  outline: 1px solid lightgray;
  border: 1px solid lightgray;
}
.day:hover {
  background: hsl(0, 0%, 93%);
  outline: 1px solid lightgray;
}
.day:active {
  background: hsl(100, 60%, 70%);
}

.day:hover .day-header,
.day.hover .day-header {
  background: darkgray;
}

*/

// background: hsl(0, 0%, 99%);

import { Date, Children } from "@/interfaces";

type AuxProps = Children & { date: Date };

export const Styles_Bodies_Day = ({ children, date }: AuxProps) => (
  <div className="flex items-start justify-start w-40 h-full pl-2 pr-32 pt-2.5 pb-2.5 border border-gray-200">
    <div className="text-sm select-none font-medium text-green-900 min-h-[6rem]">
      {date}
      {children}
    </div>
  </div>
);

export const Styles_Bodies_DayEnd = ({ children, date }: AuxProps) => (
  <div className="flex items-start justify-start w-40 h-full pl-2 pr-32 pt-2.5 pb-2.5 border border-gray-200">
    <p className="text-sm select-none font-medium text-gray-400 min-h-[6rem]">
      {date}
      {children}
    </p>
  </div>
);
