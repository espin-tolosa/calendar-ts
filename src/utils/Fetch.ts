const FormData = require("form-data");
import { api } from "@/static/apiRoutes";
import { event, objectKeys } from "@interfaces/index";

//const hostinger = "https://samuelengineer.com";

const http_response_code: objectKeys<number> = {
  GET_ALL: 201,
  GET_FROM: 201,
  POST: 202,
  PUT: 203,
  DELETE: 204,
  DELETE_ALL: 204,
};

type ACTIONS =
  | "GET_ALL"
  | "GET_FROM"
  | "POST"
  | "PUT"
  | "DELETE"
  | "DELETE_ALL";

//apifetch({action: "POST",})

/*
useEffect(() => {
	if (isMount.current) {
		if (click === 1) {
			(async () => {
				await apifetch({
					action: action,
					...event,
				}).then((res) => {
					if (!res) {
						return;
					}

					dispatch({
						type: action,
						payload: res,
					});
				});
			})();
		}
	} else {
		isMount.current = true;
	}
	// eslint-disable-next-line
}, [isMount, click]);
}
*/
export async function fetchEvent(
  action: string,
  event: event = { id: 0, client: "", job: "", start: "", end: "" }
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

export async function apifetch(query: { action: string }) {
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
        const { action, ...event } = query;
        return event;
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      alert("Error No internet connection");
      return false;
    });
}
