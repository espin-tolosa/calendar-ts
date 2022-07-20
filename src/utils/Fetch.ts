// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = require("form-data");
import { api } from "@/static/apiRoutes";

//const hostinger = "https://samuelengineer.com";

const http_response_code: Record<string, number> = {
  GET_ALL: 201,
  GET_FROM: 201,
  POST: 202,
  PUT: 203,
  DELETE: 204,
  DELETE_ALL: 204,
};

export async function fetchEvent_v2(
  action: string,
  event: jh.event = {
    id: 0,
    client: "",
    job: "",
    start: "",
    end: "",
    type: "",
  }
) {
  const data = new FormData();
  if (typeof event === "undefined") {
    data.append("json", JSON.stringify({ action }));
  } else {
    data.append("json", JSON.stringify({ action, ...event }));
  }
  return fetch(api.routes.events, {
    method: "POST",
    body: data,
  });
}

export async function apifetch(query: { action: string; debug: string }) {
  const data = new FormData();
  data.append("json", JSON.stringify(query));

  return fetch(api.routes.events, {
    method: "POST",
    body: data,
  })
    .then((res) => {
      if (res.status === 200) {
        alert("Permissions expired");
        return false;
      }
      if (http_response_code[query.action] !== res.status) {
        if (res.status === 401 || res.status === 403) {
          alert("Permissions expired, please refresh");
        }
        return false;
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return res.json();
      } else {
        //* NOTE: I'm removing the action from the query, and then returning the event, It's horrible but API returns nothing, I need the idevent
        //! QUE MIERDA ES ESTO JODER
        return query.debug;
      }
    })
    .then((res) => {
      return res;
    })
    .catch(() => {
      alert("Error No internet connection");
      return false;
    });
}
