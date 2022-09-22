import { ComposeDate } from "@/utils/Date";
import { createContext, useState } from "react";
import { MemoDay } from "../../Day/main";

export const textAreaCtx = createContext<jh.textArea|null>(null);

export function CurrentDays ({days, year, month}:{days: number[], year: number, month: number})
{
    const [textArea, setTextArea] = useState(0);
    const [textEvent, setTextEvent] = useState(0);

    return (
        <textAreaCtx.Provider value={{textArea, setTextArea, textEvent, setTextEvent}} >
            {
                days.map( day => <MemoDay   key={ComposeDate(year, month, day)}
                                            day={day}
                                            fullDate={ComposeDate(year, month, day)}
                                        />
                ) 
            }
        </textAreaCtx.Provider>
    )

}