import { useRef, useState } from "react";

export function Debug({children, label, color}:{children: JSX.Element, label?:string|number, color?:string})
{
    const [isHidden, setIsHidden] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const thisNode = useRef<HTMLDivElement>(null);

    color ??= "rgb(0.7,0.7,0.7,0.1)";
    label ??= JSON.stringify( Object.values(children.props).map(k=> typeof k !== "object" ? String(k) : "" ) );

    const bgColor = !isHidden ? color : !isHover ? "red" : color;

    return (
        <div
            style={ {height:thisNode.current?.clientHeight, background: bgColor} }
            ref={thisNode}
            title={label.toString()}
            onMouseDown={(e)=>{e.stopPropagation(); setIsHidden(true)}}
            onMouseUp={(e)=>{e.stopPropagation();setTimeout(()=>setIsHidden(false),10)}}
            onMouseLeave={()=>setIsHover(true)}
            onMouseEnter={()=>setIsHover(false)}
        >
            {!isHidden ? children :  <></> }
        </div>
    )

}