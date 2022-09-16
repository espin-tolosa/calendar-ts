import { TWboard } from "./tw";
import { MemoMonth } from "../components/Month/main";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useGetAllEventsFrom } from "../api/useGetAllEventsFrom";

export const LayoutBoard = () => {
  const [monthsOfBoard, last] = useInfiniteScroll();

  //Query All Events
  const hFetchAll = useGetAllEventsFrom();

  //Fetch event after login

  return (
    <TWboard id={"Board"}>
      <div
        className="sticky-footer w-min p-5 h-10 z-TopLayer bg-slate-400/50 flex items-center rounded-md text-white print:hidden"
        onClick={hFetchAll}
      >
        {"📩"}
      </div>
      <div
        className="sticky-footer left-20 w-min p-5 h-10 z-TopLayer bg-slate-400/50 flex items-center rounded-md text-white print:hidden"
        onClick={() => {
          window.alert("Delete event not implemente jet");
        }}
      >
        {"❌"}
      </div>
      {monthsOfBoard.map((value) => {
        return <MemoMonth key={`${value.year}-${value.month}`} {...value} />;
      })}
      <div ref={last}></div>
    </TWboard>
  );
};
