import * as StyledEvent from "./tw";
import { useEventDispatch } from "../../hooks/useEventsState";
import { useControllerDispatch } from "../../hooks/useController";
import { useClientsStyles } from "../../context/useFetchClientStyle";
import { EventClass } from "@/Calendar/classes/event";
import { FetchEvent } from "@/Calendar/classes/fetchEvent";
import { useAuthLevel } from "@/Spa/context/authLevel";

export type ClientSelector = {
  style: {background: string, borderTop?: string, borderBottom?: string}
  event: jh.event;
};

export function EventClientSelector(props: ClientSelector): JSX.Element {
    const auth = useAuthLevel();
    const clientStyles = useClientsStyles();
    const eventDispatcher = useEventDispatch();
    const controllerStateDispatch = useControllerDispatch();
    const updateClient = (client: string) => {
    const request = new FetchEvent();
    const updateEvent = {...props.event, client};
    request.update(updateEvent)
    eventDispatcher({type: "update", payload: [updateEvent]});

    controllerStateDispatch({
      type: "setId",
      payload: { id: props.event.id },
    });

    setTimeout(() => {
      //console.log("Reset id", props.event);

      controllerStateDispatch({
        type: "setId",
        payload: { id: 0 },
      });
    }, 2000);
  };

  const styleFilterBorder =
    !props.event.done ?
        props.style :
    props.event.client !== "unavailable" ?
        {background: props.style.background, borderTop: "2px solid transparent", borderBottom: "2px solid transparent"  } :
    props.event.client === "unavailable" ?
        {background: "gray", color: "gray", borderTop: "2px solid transparent", borderBottom: "2px solid transparent"} :
        {color: props.style.background, background: props.style.background, borderTop: "2px solid transparent", borderBottom: "2px solid transparent"};

  /**
   * Client
   */
  if(auth === "client")
  {
    return (
        <StyledEvent.TWStyledNonSelect style={styleFilterBorder}>
            {
                props.event.client
            }
        </StyledEvent.TWStyledNonSelect>
    )
  }

  /**
   * Partner //TODO: add checkbox
   */
  if(auth === "partner")
  {
    return (
        <StyledEvent.TWStyledCheckboxSelect style={styleFilterBorder}
        title={"Mark this event as done"}
        onClick={(e)=>{
            eventDispatcher({type: "update", payload: [{...props.event, done: String(!EventClass.isDone(props.event))}]});
            const Event = new FetchEvent();
            Event.update({...props.event, done: String(!EventClass.isDone(props.event))})
        }}
        >
            <div>{
                props.event.client.charAt(0).toUpperCase() + props.event.client.slice(1)
            }</div>
        </StyledEvent.TWStyledCheckboxSelect>
    )
  }


    return (
        <StyledEvent.TWStyledSelect
        value={props.event.client}
        style={styleFilterBorder}
        id={EventClass.eventID(props.event.id, "master", "clientSelector")}
        onChange={(e) => {
            if (e.currentTarget.value === "")
            {
                window.alert("delete");
            }
            
            updateClient(e.currentTarget.value);
            e.currentTarget.blur();
            }
        }
        >
        <DefaultOption client={props.event.client} />

        <ClientOptionList list={clientStyles} />
        </StyledEvent.TWStyledSelect>
    );
}

const DefaultOption = (props: { client: string }) => (
  <option value="default" hidden disabled={props.client !== "Select Client"}>
    Select Client
  </option>
);

const ClientOptionList = ({list}: {list: jh.response.maybe<jh.response.styles>}): JSX.Element =>
{
    if (!list.success)
    {
        return <option>{"loading client list..."}</option>;
    }

    const styleList = Object.values(list.response.colors);
    const types = ["client","team","public","private"];
    const styleGroups = types.map(type => {
        return styleList.filter(style => style.type === type)
    })

    return (
    <>
    {
        styleGroups.map((collection,index) => {
            return (<optgroup key={`optgroup-${types[index]}`} label={types[index]}>
                {
                    collection.map(entry => {
                        return (
                            <option key={entry.name} value={entry.name}>
                            {
                                //entry.name
                                entry.name.charAt(0).toUpperCase() + entry.name.slice(1)
                            }
                            </option>
                        )
                    })
                }

            </optgroup>)
        })
    //    list.response.clients.map((clientIterator, index) =>
    //    {
    //        return (
    //            <option key={index} value={clientIterator}>
    //            {
    //                clientIterator
    //            }
    //            </option>
    //        );
    //    })
    }
    </>
  );
};
