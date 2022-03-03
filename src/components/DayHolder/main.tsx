import * as StyledDay from "@/components/DayHolder/tw";
import { memo } from "react";

function IDayHolder() {
  return <StyledDay.TWsizedContainer></StyledDay.TWsizedContainer>;
}

export const MemoIDayHolder = memo(IDayHolder);
