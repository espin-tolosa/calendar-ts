import * as StyledEvent from "./tw";
//!import { useEventDispatch, useGetEventFamily } from "../../hooks/useEventsState";
//!import { useDnDEventRef, useSetDnDEventRef } from "../../context/dndEventRef";
//!import { nullEvent } from "../../interfaces";
//!import { useGethDeleteEvent } from "../../api/handlers";
import { useHoverEvent } from "../../components/Event/logic";
import { EventClass } from "@/classes/event";

interface DragHandlers {
    event: jh.event;
    //!spread: number;
    children: JSX.Element;
}

//!Uncoment for master view

export function DragHandlers({event, /*spread,*/ children}: DragHandlers): JSX.Element
{
    const mouseEventHover = useHoverEvent(event);
//!    const [parentEvent] = useGetEventFamily(event);
//!    const hDelete = useGethDeleteEvent(event);
//!    const eventDispatcher = useEventDispatch();
//!    const setDnDEventRef = useSetDnDEventRef();
//!    const dndEvent = useDnDEventRef();

//!    const hOnDragEnd = (e: React.DragEvent<HTMLDivElement>) =>
//!    {
//!        e.stopPropagation();
//!        setDnDEventRef(nullEvent());
//!        eventDispatcher({type: "fromnull", payload: [ dndEvent ]});
//!    };

//!   const hOnDragStart = (e: React.DragEvent<HTMLDivElement>, direction: jh.dragDirection) =>
//!   {
//!       e.stopPropagation();
//!       const parentCopy: jh.event = { ...parentEvent };

//!       if (typeof parentEvent.mutable === "object")
//!       {
//!           parentCopy.mutable = { ...parentEvent.mutable };
//!           if (typeof parentCopy.mutable === "object")
//!           {
//!               parentCopy.mutable.dragDirection = direction;
//!           }
//!       }
//!   
//!       setDnDEventRef(parentCopy);

//!       setTimeout(() => {eventDispatcher({type: "tonull", payload: [event]});}, 1000);
//!   };
    
//!    const hDeleteEventOnCtrlSupr = (e: React.KeyboardEvent<HTMLDivElement>) =>
//!    {
//!        e.stopPropagation();
//!        if (e.ctrlKey && e.code === "Delete")
//!        {
//!            hDelete();
//!        }
//!    }

    return (
    
        <StyledEvent.TWflexContainer id={EventClass.eventID(event.id, "master", "eventListener")}

            //!onKeyDown={hDeleteEventOnCtrlSupr}
            onMouseEnter={mouseEventHover.onMouseEnter}
            onMouseLeave={mouseEventHover.onMouseLeave}
            //!onDragStart={(e) => {hOnDragStart(e, "none");}}
            //!onDragEnd={hOnDragEnd}
        >

            {children}

        {//!<StyledEvent.TWextend_Left $cells={spread} title={`Drag here to extend ${event.client}'s job`}

         //!   draggable={"true"}
         //!   onDragStart={(e) => {hOnDragStart(e, "backward");}}
         //!   onDragEnd={hOnDragEnd}
        //!>

         //! {"+"}

        //! </StyledEvent.TWextend_Left>
        }

        {
        //!<StyledEvent.TWextend $cells={spread} title={`Drag here to extend ${event.client}'s job`}

        //!    draggable={"true"}
        //!    onDragStart={(e) => {hOnDragStart(e, "forward");}}
        //!    onDragEnd={hOnDragEnd}
        //!>
        //!    {"+"}

        //!</StyledEvent.TWextend>
        }
    
</StyledEvent.TWflexContainer>
  );
}
