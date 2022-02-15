import * as StyledDay from "@components/Day/tw";
import { memo, useState } from "react";
import { useControllerDispatch } from "@/hooks/useController";

type WithChildren<T = {}> = T & { children?: React.ReactNode };
type IDayProps = WithChildren<{
  daynumber: number;
  fullDate: string;
}>;
export function IDay({ children, daynumber, fullDate }: IDayProps) {
  const tempDay = String(daynumber);
  const dayPadd = daynumber < 10 ? `0${tempDay}` : tempDay;
  const [lock, setLock] = useState(false);
  const distpatchController = useControllerDispatch();

  //day-off

  return (
    <StyledDay.TWsizedContainer
      $top={lock}
      onClick={() => {
        distpatchController({
          type: "setDates",
          payload: { start: fullDate, end: fullDate },
        });
      }}
      onMouseUp={() => {
        console.log("leaving action at day:", dayPadd);
      }}
      onMouseEnter={() => console.log("passing over:", dayPadd)}
    >
      <StyledDay.TWheader
        title={(() => {
          return (lock ? "Unlock " : "Lock ") + `day: ${dayPadd}`;
        })()}
        onClick={() => {
          setLock((prev) => !prev);
        }}
      >
        <StyledDay.TWdaySpot>{dayPadd}</StyledDay.TWdaySpot>
      </StyledDay.TWheader>
      {children}
    </StyledDay.TWsizedContainer>
  );
}

export const MemoIDay = memo(IDay);

//  console.warn("Memo day");
//console.log("prevProps", prevProps);
// console.log("nextProps", nextProps);
//return false;
//});
