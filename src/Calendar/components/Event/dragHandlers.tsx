import * as StyledEvent from "./tw";

//! START COMMENT
import { useEventDispatch, useGetEventFamily } from "../../hooks/useEventsState";
import { useDnDEventRef, useSetDnDEventRef } from "../../context/dndEventRef";
import { nullEvent } from "../../interfaces";
import { useGethDeleteEvent } from "../../api/handlers";
//! END COMMENT

import { useHoverEvent } from "../../components/Event/logic";
import { EventClass } from "../../classes/event";

interface DragHandlers {
    event: jh.event;
    //! START COMMENT
    spread: number;
    //! END COMMENT
    children: JSX.Element;
}


export function DragHandlers({event,
    //! START COMMENT
    spread,
    //! END COMMENT
     children}: DragHandlers): JSX.Element
{
    const mouseEventHover = useHoverEvent(event);
//! START COMMENT
    const [parentEvent] = useGetEventFamily(event);
    const hDelete = useGethDeleteEvent(event);
    const eventDispatcher = useEventDispatch();
    const setDnDEventRef = useSetDnDEventRef();
    const dndEvent = useDnDEventRef();

    const hOnDragEnd = (e: React.DragEvent<HTMLDivElement>) =>
    {
        e.stopPropagation();
        setDnDEventRef(nullEvent());
        eventDispatcher({type: "fromnull", payload: [ dndEvent ]});
    };

   const hOnDragStart = (e: React.DragEvent<HTMLDivElement>, direction: jh.dragDirection) =>
   {
       e.stopPropagation();
       const parentCopy: jh.event = { ...parentEvent };

       if (typeof parentEvent.mutable === "object")
       {
           parentCopy.mutable = { ...parentEvent.mutable };
           if (typeof parentCopy.mutable === "object")
           {
               parentCopy.mutable.dragDirection = direction;
           }
       }

       setDnDEventRef(parentCopy);

       setTimeout(() => {eventDispatcher({type: "tonull", payload: [event]});}, 1000);
   };

    const hDeleteEventOnCtrlSupr = (e: React.KeyboardEvent<HTMLDivElement>) =>
    {
        e.stopPropagation();
        if (e.ctrlKey && e.code === "Delete")
        {
            hDelete();
        }
    }
//! END COMMENT

    return (
    
        <StyledEvent.TWflexContainer id={EventClass.eventID(event.id, "master", "eventListener")}

            onMouseEnter={mouseEventHover.onMouseEnter}
            onMouseLeave={mouseEventHover.onMouseLeave}
            //! START COMMENT
            onKeyDown={hDeleteEventOnCtrlSupr}
            onDragStart={(e) => {hOnDragStart(e, "none");}}
            onDragEnd={hOnDragEnd}
            //! END COMMENT
        >

            {children}

        {
        //! START COMMENT
        <StyledEvent.TWextend_Left $cells={spread} title={`Drag here to extend ${event.client}'s job`}

            draggable={"true"}
            onDragStart={(e) => {hOnDragStart(e, "backward");}}
            onDragEnd={hOnDragEnd}
        >

          {"+"}
         </StyledEvent.TWextend_Left>
        //! END COMMENT
        }

        {
        //! START COMMENT
        <StyledEvent.TWextend $cells={spread} title={`Drag here to extend ${event.client}'s job`}

            draggable={"true"}
            onDragStart={(e) => {hOnDragStart(e, "forward");}}
            onDragEnd={hOnDragEnd}
        >
            {"+"}
        </StyledEvent.TWextend>
        //! END COMMENT
        }
    
</StyledEvent.TWflexContainer>
  );
}
