import { TWboard } from "./tw";
import { MemoMonth } from "../components/Month/main";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { ListPrevDates } from "../utils/Date";
import { useGetAllEventsFrom } from "../api/useGetAllEventsFrom";

export const LayoutBoard = () => {
  const nextDates = useInfiniteScroll(1);
  const prevDates = ListPrevDates(nextDates[0], 2);
  //Query All Events
  const hFetchAll = useGetAllEventsFrom(prevDates[1]);

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
      <MemoMonth {...prevDates[1]} />
      <MemoMonth {...prevDates[0]} />
      {nextDates.map((value) => {
        return <MemoMonth key={`${value.year}-${value.month}`} {...value} />;
      })}
      <div id="BottomEdge"></div>
    </TWboard>
  );
};
