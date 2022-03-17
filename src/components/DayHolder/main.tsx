import * as StyledDay from "@/components/DayHolder/tw";
import { Droppable } from "react-beautiful-dnd";
import { memo } from "react";
type IDayProps = {
  fullDate: string;
};

function IDayHolder({ fullDate }: IDayProps) {
  return (
    <Droppable droppableId={fullDate}>
      {(provided, snapshot) => (
        <StyledDay.TWsizedContainer
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {fullDate}
        </StyledDay.TWsizedContainer>
      )}
    </Droppable>
  );
}

export const MemoIDayHolder = memo(IDayHolder);
