import { TWboard } from "./tw";
import { MemoMonth } from "@/components/Month/main";
import { useBoardScroll } from "@/hooks/useBoardScroll";
import { ListPrevDates } from "@/utils/Date";

export const LayoutBoard = () => {
  const nextDates = useBoardScroll({ initialLength: 1 });
  const prevDates = ListPrevDates(nextDates[0], 2);

  return (
    <TWboard id={"Board"}>
      <MemoMonth {...prevDates[1]} />
      <MemoMonth {...prevDates[0]} />
      {nextDates.map((value, index) => {
        return <MemoMonth key={`${value.year}-${value.month}`} {...value} />;
      })}
      <div id="BottomEdge"></div>
    </TWboard>
  );
};
