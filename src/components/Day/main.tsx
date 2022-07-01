import { styles } from "../../components/Day/tw";
import { MemoEventsThrower } from "../../components/EventsThrower/main";
import { memo } from "react";
import { DateService } from "../../utils/Date";
import { usePostQuery } from "../../api/queries";
import { useDoubleClick } from "../../hooks/useDoubleClick";

interface Day {
  daynumber: number;
  fullDate: string;
  pushedDays: Set<string>;
}

// Used Context in Day Component:
//
// cDayLock
// cDayLockDispatcher
// cUseLocalUserPreferences
// cEventSelected
// cSetEventSelected
// cControllerState - start,end
// cControllerState - id,client,job

function Day({ daynumber, fullDate, pushedDays }: Day) {
  //Callbacks

  const addEvent = usePostQuery(fullDate);

  //Computed:
  //TODO: Locked days not impl
  const $isLock = false;
  const $isWeekend = DateService.IsWeekend(fullDate);
  const styledProps = { $isWeekend, $isLock };
  const isToday = fullDate === DateService.FormatDate(DateService.GetDate());
  const hAddEvent = useDoubleClick(addEvent);

  return (
    <styles.contain id={`day:${fullDate}`} {...styledProps} {...hAddEvent}>
      <styles.header id={`day-header:${fullDate}`} {...styledProps}>
        <styles.daySpot
          id={`day-spot:${fullDate}`}
          $isToday={isToday}
        >{`${daynumber}`}</styles.daySpot>
      </styles.header>

      <MemoEventsThrower day={fullDate} pushedDays={pushedDays} />
    </styles.contain>
  );
}

export const MemoDay = memo(Day, (prev, next) => {
  const isDayToPush = next.pushedDays.has(next.fullDate);

  return !isDayToPush;
});
