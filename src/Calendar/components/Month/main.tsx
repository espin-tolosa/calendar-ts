import { useMonthDate } from "../../hooks/useMonthDate";
import {TWdaysBoard} from "./tw";

import { CurrentMonthScrollAnchor } from "./components/MonthToScrollBack";
import { totalCellsInLastRow } from "./totalCellsInLastRow";

import { MonthLayout} from "./components/MonthLayout";
import { usePrintPDF } from "./usePrintPDF";
import { PaddedDays } from "./components/PaddedDays";
import { MonthHeader } from "./components/MonthHeader";
import { useMemo } from "react";
import { ComposeDate } from "../../utils/Date";
import { MemoDay } from "../Day/main";

const Month = ({ year, month, onDoubleClick } : jh.date.monthData & {onDoubleClick: ()=>void} ) => {

    const date = useMonthDate(year, month);
  
    const [prevMonth, nextMonth] = totalCellsInLastRow(date.start, date.daysList.length);

  //-----------------------------------------------------------------------------------------------
    const printer = usePrintPDF();
    const dayList = useMemo(()=> date.daysList.map(day=>ComposeDate(year, month, day)), [year, month, date.daysList]);
 
    return (
        <>
            <MonthLayout print={printer.isVisible}>
        
                <MonthHeader year={date.year} month={date.month} date={date.dateFormat}
                //! START COMMENT
                onDoubleClick={printer.hsend}
                //! END COMMENT
                />

                <TWdaysBoard>

                    <PaddedDays days={prevMonth} year={date.year} month={date.month} paddPosition={"prev"} />

                    {
                        dayList.map(fullDate => <MemoDay key={fullDate} fullDate={fullDate}/>)
                    }

                    <PaddedDays days={nextMonth} year={date.year} month={date.month} paddPosition={"next"} />

                </TWdaysBoard>
        
                <CurrentMonthScrollAnchor {...{ year, month }} />

            </MonthLayout>
        </>
  );
};

export const MemoMonth = Month;
