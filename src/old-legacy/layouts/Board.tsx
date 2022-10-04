import { TWboard } from "./tw";
import { MemoMonth } from "../components/Month/main";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { dispatchAllFetchEvents } from "../api/useGetAllEventsFrom";

export const LayoutBoard = () => {
  const [monthsOfBoard, last] = useInfiniteScroll();

  //TODO: Fetching too late
  dispatchAllFetchEvents();

  return (

    <TWboard id={"Board"}>
      {monthsOfBoard.map((value) => {
        return <MemoMonth key={`${value.year}-${value.month}`} {...value} />;
      })}

      <div ref={last}></div>

    </TWboard>
  );
};
