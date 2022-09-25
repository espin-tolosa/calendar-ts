import { createContext, useMemo, useState } from "react";
import { ComposeDate } from "../../../utils/Date";
import { MemoDay } from "../../Day/main";

export const textAreaCtx = createContext<jh.textArea|null>(null);

//export function CurrentDays ({days, year, month}:{days: number[], year: number, month: number})
export function CurrentDays({children}:{children:JSX.Element})
{
    const [textArea, setTextArea] = useState(0);
    const [textEvent, setTextEvent] = useState(0);

    //const dayList = useMemo(()=> days.map(day=>ComposeDate(year, month, day)), [year, month, days]);

    return (
        <textAreaCtx.Provider value={{textArea, setTextArea, textEvent, setTextEvent}}>
        {
            children
            //dayList.map(fullDate => <MemoDay key={fullDate} fullDate={fullDate}/>)
        }
        </textAreaCtx.Provider>
    )

}