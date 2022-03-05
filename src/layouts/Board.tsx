import { TWboard } from "./tw";
import { MemoMonth } from "@/components/Month/main";
import { useBoardScroll } from "@/hooks/useBoardScroll";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { ListPrevDates } from "@/utils/Date";

export const LayoutBoard = () => {
  const nextDates = useBoardScroll({ initialLength: 1 });
  const prevDates = ListPrevDates(nextDates[0], 2);

  /* Automatic scroll when refresh the page */
  const autoScrollTarget = useAutoScroll();
  //*--------------------------*/
  return (
    <TWboard id={"Board"}>
      <MemoMonth id={"PrevMonth-2"} {...prevDates[1]} />
      <MemoMonth id={autoScrollTarget} {...prevDates[0]} />
      {nextDates.map((value, index) => {
        return (
          <MemoMonth
            id={`NextMonth-${index}`}
            key={`${value.year}-${value.month}`}
            {...value}
          />
        );
      })}
      <div id="BottomEdge"></div>
    </TWboard>
  );
};
