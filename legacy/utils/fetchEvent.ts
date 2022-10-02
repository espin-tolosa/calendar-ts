import { apiRoutes } from "@/static/apiRoutes";
import { nullEvent } from "../interfaces";

/**
 * Fetch events to API
 */
export async function fetchEvent_Day(
  action: CustomTypes.OptionsEventsAPI,
  event: jh.event = nullEvent()
) {
  const data = new FormData();
  const filterEvent = (({ id, client, job, start, end }) => ({
    id,
    client,
    job,
    start,
    end,
  }))(event);

  const dataJSON = JSON.stringify({ action, ...filterEvent });
  data.append("json", dataJSON);
  const response = await fetch(apiRoutes.event, {
    method: "POST",
    body: data,
  });

  if (response.status === 401) {
    window.alert("Error: User not authenticated");
    //throw Error("No JWT");
  }

  if (response.status === 402) {
    //TODO: this refetch in cases of not affected rows is super buggy because not affected row response could be many things
    //  if (
    //    window.confirm(
    //      "It seems the selected event isn't exixts in DB, do you want to create it?"
    //    )
    //  ) {
    //    fetchEvent("POST", event).then(() => {
    //      window.location.reload();
    //    });
    //  }
  }

  if (response.status === 404) {
    window.alert("Error: User not authenticated");
    //throw Error("No credentials");
  }

  return await response.json();
}
//TODO: add a callback to reset the state of a failed optimistic fetch operation
export async function fetchEvent(
  action: CustomTypes.OptionsEventsAPI,
  event: jh.event = nullEvent()
) {
  const data = new FormData();
  const filterEvent = (({ id, client, job, start, end }) => ({
    id,
    client,
    job,
    start,
    end,
  }))(event);
  const dataJSON = JSON.stringify({ action, ...filterEvent });

  data.append("json", dataJSON);

  const response = await fetch(apiRoutes.event, {
    method: "POST",
    body: data,
  });

  if (response.status === 401) {
    window.alert("Error: User not authenticated");
    //throw Error("No JWT");
  }

  if (response.status === 402) {
    //window.alert("Error: Current layout isn't synchronized with DB");
    //throw Error("Event id not found in DB");
  }

  if (response.status === 404) {
    window.alert("Error: User not authenticated");
    //throw Error("No credentials");
  }

  return response;
}
