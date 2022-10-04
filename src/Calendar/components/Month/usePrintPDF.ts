import { useAuthLevel } from "@/Spa/context/authLevel";
import { useEffect, useState } from "react";

export function usePrintPDF()
{
    const [print, setPrint] = useState(false);
    const auth = useAuthLevel();
    console.log("AUTH", auth)
 
    useEffect(()=>{

        const isSupported = Object.prototype.hasOwnProperty.call(window, "print");
        
        if(!print) {return;}
        if (!isSupported) {window.alert("Print to PDF isn't supported in this device jet"); return;}
       
        window.print();
        setPrint(false)
 
    },[print])

    if(auth === "master" || auth === "partner")
    {
        return {isVisible: print, hsend: ()=>setPrint(true)};
    }
    else
    {
        return {isVisible: print, hsend: ()=>{}};
    }

}