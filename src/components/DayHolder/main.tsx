import * as StyledDay from "@/components/DayHolder/tw";
import { Droppable } from "react-beautiful-dnd";
import { memo } from "react";
type IDayProps = {
  fullDate: string;
};

function IDayHolder({ fullDate }: IDayProps) {
  return <StyledDay.TWsizedContainer>{fullDate}</StyledDay.TWsizedContainer>;
}

export const MemoIDayHolder = memo(IDayHolder);
