import { CustomTypes, CustomValues } from "@/customTypes";
import { event } from "@/interfaces";
import { api } from "@/static/apiRoutes";

export async function fetchEvent(
  action: CustomTypes.OptionsEventsAPI,
  event: event = CustomValues.nullEvent
) {
  const data = new FormData();
  const dataJSON = JSON.stringify({ action, ...event }); //! event should be passed as plain object to the api
  data.append("json", dataJSON);
  return fetch(api.routes.events, {
    method: "POST",
    body: data,
  });
}

// DELETE
// POST
// PUT
// GET_FROM

//-------------------------------------------------------------------------------------------------------------------------------------------------

//  App: 62
//
//  const result = fetchEvent_App("DELETE", eventSelected!);
//  result.then((res) => {
//    if (res.status === 204) {
//      eventDispatcher({
//        type: "deletebyid",
//        payload: [eventSelected!],
//      });
//      dispatchController({
//        type: "setController",
//        payload: { id: 0, client: "", job: "" },
//      });
//      dispatchControllerDates({
//        type: "clearDates",
//      });
//    }
//  });

//  Controller 220
//
//  const result = fetchEvent_Controller("DELETE", eventSelected!);
//  result.then((res) => {
//    if (res.status === 204) {
//      eventDispatcher({
//        type: "deletebyid",
//        payload: [eventSelected!],
//      });
//      dispatchController({
//        type: "setController",
//        payload: { id: 0, client: "", job: "" },
//      });
//      dispatchControllerDates({
//        type: "clearDates",
//      });
//    }
//  });

//-------------------------------------------------------------------------------------------------------------------------------------------------

//  App: 194
//
//  const fetchResultPUT = fetchEvent_App("PUT", newEvent);
//  isDragging.setState(false);
//  dispatchHoveringId(0);
//  fetchResultPUT
//    .then((res) => {
//      if (res.status !== 203) {
//        throw new Error("Error code differs from expected");
//      }
//      const newEvent = {
//        id: event.id,
//        client: event.client,
//        job: event.job,
//        start: event.start,
//        end: destination?.droppableId!,
//      };
//      eventDispatcher({
//        type: "replacebyid",
//        payload: [newEvent],
//      });
//    })
//    .catch(() => {
//      eventDispatcher({
//        type: "replacebyid",
//        payload: [eventStartDragging.current],
//      });
//    });

//  Controller 106
//
//  const result = fetchEvent_Controller("PUT", {
//    id,
//    client,
//    job,
//    start,
//    end,
//  });
//  result.then((res) => {
//    if (res.status === 203) {
//      eventDispatcher({
//        type: "replacebyid",
//        payload: [
//          {
//            id,
//            client,
//            job,
//            start,
//            end,
//          },
//        ],
//      });
//    }
//  });

//-------------------------------------------------------------------------------------------------------------------------------------------------

//  Month: 92
//
//  setIsFetching(true);
//  const result = fetchEvent_Month("GET_FROM", {
//    id: 0,
//    client: "",
//    job: "",
//    start: `${year}-${month}-01`,
//    end: "",
//  });
//  result
//    .then((res) => res.json())
//    .then((json: Array<event>) =>
//      json.forEach((event: event) => {
//        eventsDispatcher({
//          type: "appendarray",
//          payload: [
//            {
//              id: event.id,
//              client: event.client,
//              job: event.job,
//              start: event.start,
//              end: event.end,
//            },
//          ],
//        });
//        setIsFetching(false);
//      })
//    )
//    .catch((e) => {
//      console.error("Possible invalid token", e);
//      let text = "Your credentials has expired, logout?";
//      if (window.confirm(text) == true) {
//        setSessionIsToClean(true);
//      }
//    });

// POST --------------------------------------------------------------------------------------------------------------------------------

//  Controller 158
//
//  const result = fetchEvent_Controller("POST", {
//    id: Math.floor(Math.random() * 1000),
//    client,
//    job,
//    start,
//    end,
//  });
//  result
//    .then((res: any) => res.json())
//    .then((json) => {
//      scrollToDay(start);
//      eventDispatcher({
//        type: "appendarray",
//        payload: [
//          {
//            id: json[0].id,
//            client: json[0].client,
//            job: json[0].job,
//            start: json[0].start,
//            end: json[0].end,
//          },
//        ],
//      });
//    });
