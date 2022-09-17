import { usePushedDays } from "@/hooks/usePushDays";
import { ComposeDate } from "@/utils/Date";
import { useState } from "react";
import { MemoDay } from "../Day/main";

export function CurrentDays ({days, year, month}:{days: number[], year: number, month: number})
{
  const pushedDays = usePushedDays(); //!days affected by event dispatcher
  const [textArea, setTextArea] = useState(0);
  const [textEvent, setTextEvent] = useState(0);
    return (
        <>
            {
                days.map( day => <MemoDay
                                            key={ComposeDate(year, month, day)}
                                            daynumber={day}
                                            fullDate={ComposeDate(year, month, day)}
                                            pushedDays={pushedDays}
                                            textArea={textArea}
                                            setTextArea={setTextArea}
                                            textEvent={textEvent}
                                            setTextEvent={setTextEvent}
                                            />
                )


            }
        </>
    )

}