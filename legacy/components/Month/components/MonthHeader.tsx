import { TWheader } from "../tw";
import { zeroPadd } from "../../../utils/zeroPadd";

export function MonthHeader({year, month, date,
    //! START COMMENT
    onDoubleClick,
    //! END COMMENT
}:{year:number, month:number, date: string,
    //! START COMMENT
    onDoubleClick: ()=>void,
    //! END COMMENT
    })
{
    //! Uncomment for master view
    return (

        <TWheader id={`month-${year}-${zeroPadd(month)}`}
        //! START COMMENT
            onDoubleClick={onDoubleClick}
        //! END COMMENT
        >{date}
        </TWheader>

    )
}
