import { useMonthDate } from "../../hooks/useMonthDate";
import {TWdaysBoard} from "./tw";

//import { useLocalUserPreferencesContext } from "../../hooks/useLocalUserPreferences";
import { CurrentMonthScrollAnchor } from "./components/MonthToScrollBack";
import { totalCellsInLastRow } from "./totalCellsInLastRow";

import { MonthLayout} from "./components/MonthLayout";
import { usePrintPDF } from "./usePrintPDF";
import { CurrentDays } from "./components/CurrentDays";
import { PaddedDays } from "./components/PaddedDays";
import { MonthHeader } from "./components/MonthHeader";

const Month = ({ year, month }: jh.date.monthData) => {

    const date = useMonthDate(year, month); //memoized date stats needed to render a month grid
  
    const [prevMonth, nextMonth] = totalCellsInLastRow(date.start, date.daysList.length);

  //-----------------------------------------------------------------------------------------------
    const printer = usePrintPDF();
 
    return (
        <>
    
        <MonthLayout print={printer.isVisible}>
        
            <MonthHeader year={date.year} month={date.month} date={date.dateFormat} onDoubleClick={printer.hsend}  />
            <CurrentMonthScrollAnchor {...{ year, month }} />

            <TWdaysBoard>

                <PaddedDays days={prevMonth} year={date.year} month={date.month} paddPosition={"prev"} />

                <CurrentDays days={date.daysList} year={date.year} month={date.month} />

                <PaddedDays days={nextMonth} year={date.year} month={date.month} paddPosition={"next"} />

            </TWdaysBoard>
        

        </MonthLayout>
        </>
  );
};

export const MemoMonth = Month;
//export const MemoMonth = memo(Month);
//MemoMonth.displayName = "Memoized Month";
