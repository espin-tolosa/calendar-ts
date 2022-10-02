import { useEffect, useState } from "react";

export function usePrintPDF()
{
    const [print, setPrint] = useState(false);
 
    useEffect(()=>{

        const isSupported = Object.prototype.hasOwnProperty.call(window, "print");
        
        if(!print) {return;}
        if (!isSupported) {window.alert("Print to PDF isn't supported in this device jet"); return;}
       
        window.print();
        setPrint(false)
 
    },[print])

    return {isVisible: print, hsend: ()=>setPrint(true)};
}