import { TWheader } from "./tw";
import { TWflexColLayout } from "./tw";
import { zeroPadd } from "../../utils/zeroPadd";
import { usePrint } from "../../hooks/usePrint";
import { useEffect, useState } from "react";

export function MonthLayout({print, children}:{print: boolean, children: JSX.Element[] })
{
    

    const attributes = {
        "$toPrint": print,
        "title": "Double click here to print this month",
    }
  
    return (

        <TWflexColLayout {...attributes} > {children}
        </TWflexColLayout>
    )
}

export function MonthHeader({year, month, date, onDoubleClick}:{year:number, month:number, date: string, onDoubleClick: ()=>void})
{
    
    
    return (

        <TWheader id={`month-${year}-${zeroPadd(month)}`} onDoubleClick={onDoubleClick} > {date}
        </TWheader>

    )
}