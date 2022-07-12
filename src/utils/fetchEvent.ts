import { CustomTypes, nullEvent } from "@/customTypes";
import { event } from "@/interfaces/index";
import { api } from "@/static/apiRoutes";

/**
 * Fetch events to API
 */
export async function fetchEvent_Day(
  action: CustomTypes.OptionsEventsAPI,
  event: event = nullEvent()
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
  const response = await fetch(api.routes.events, {
    method: "POST",
    body: data,
  });

  if (response.status === 401) {
    throw Error("No JWT");
  }

  if (response.status === 404) {
    throw Error("No credentials");
  }

  return await response.json();
}
export async function fetchEvent(
  action: CustomTypes.OptionsEventsAPI,
  event: event = nullEvent()
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
  const response = await fetch(api.routes.events, {
    method: "POST",
    body: data,
  });

  if (response.status === 401) {
    throw Error("No JWT");
  }

  if (response.status === 404) {
    throw Error("No credentials");
  }

  return response;
}
