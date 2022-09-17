import { zeroPadd } from "@/utils/zeroPadd";
import { MemoIDayHolder } from "../DayHolder/main";

export function PaddedDays({days, year, month, paddPosition}:{days:number[], year:number, month:number, paddPosition:string})
{
    const uuid = (day:number) => `${paddPosition}:${year}-${zeroPadd(month)}-${zeroPadd(day)}`

    return (
        <>
            {days.map((day) => <MemoIDayHolder key={uuid(day)} fullDate={uuid(day)} />)}
        </>
    )

}