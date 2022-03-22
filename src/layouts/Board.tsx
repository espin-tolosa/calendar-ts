import { TWboard } from "./tw";
import { MemoMonth } from "@/components/Month/main";
import { useBoardScroll } from "@/hooks/useBoardScroll";
import { ListPrevDates } from "@/utils/Date";
import {
  useTemporaryEvent,
  useTemporaryEventDispatcher,
} from "@/globalStorage/temporaryEvents";
import { fetchEvent } from "@/utils/fetchEvent";
import { useEventDispatch } from "@/hooks/useEventsState";

export const LayoutBoard = () => {
  const nextDates = useBoardScroll({ initialLength: 1 });
  const prevDates = ListPrevDates(nextDates[0], 2);
  const temporaryEvent = useTemporaryEvent();
  const temporaryEventDispatcher = useTemporaryEventDispatcher();
  const eventDispatcher = useEventDispatch();
  console.log("Board", temporaryEvent);

  return (
    <TWboard $disableScroll={temporaryEvent.id !== 0} id={"Board"}>
      <MemoMonth {...prevDates[1]} />
      <MemoMonth {...prevDates[0]} />
      {nextDates.map((value, index) => {
        return <MemoMonth key={`${value.year}-${value.month}`} {...value} />;
      })}
      <div id="BottomEdge"></div>
    </TWboard>
  );
};
