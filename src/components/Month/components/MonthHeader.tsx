import { TWheader } from "../tw";
import { zeroPadd } from "../../../utils/zeroPadd";

export function MonthHeader({year, month, date /*, onDoubleClick*/}:{year:number, month:number, date: string /*, onDoubleClick: ()=>void*/})
{
    //! Uncomment for master view
    return (

        <TWheader id={`month-${year}-${zeroPadd(month)}`}
        //!onDoubleClick={onDoubleClick}
        >{date}
        </TWheader>

    )
}