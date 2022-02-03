import * as StyledDay from "@components/Day/tw";
import { EventsThrower } from "@components/EventsThrower/main";
import { memo, useState } from "react";

export const Day = ({ daynumber }: { daynumber: number }) => {
  const tempDay = String(daynumber);
  const dayPadd = daynumber < 10 ? `0${tempDay}` : tempDay;

  //day-off
  const top = daynumber <= 5 && daynumber >= 3 ? true : false;

  return (
    <StyledDay.TWsizedContainer
      $top={top}
      onMouseUp={() => {
        console.log("leaving action at day:", dayPadd);
      }}
      onMouseEnter={() => console.log("passing over:", dayPadd)}
    >
      <StyledDay.TWheader>
        <StyledDay.TWdaySpot>{dayPadd}</StyledDay.TWdaySpot>
      </StyledDay.TWheader>
      <EventsThrower day={dayPadd} />
    </StyledDay.TWsizedContainer>
  );
};

type WithChildren<T = {}> = T & { children?: React.ReactNode };
type IDayProps = WithChildren<{
  daynumber: number;
}>;
export function IDay({ children, daynumber }: IDayProps) {
  const tempDay = String(daynumber);
  const dayPadd = daynumber < 10 ? `0${tempDay}` : tempDay;
  const [lock, setLock] = useState(false);

  //day-off

  return (
    <StyledDay.TWsizedContainer
      $top={lock}
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

export const MemoIDay = memo(IDay, (prevProps, nextProps) => {
  console.warn("Memo day");
  console.log("prevProps", prevProps);
  console.log("nextProps", nextProps);
  return false;
});
