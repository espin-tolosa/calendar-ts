const FormData = require("form-data");
import { objectKeys } from "@interfaces/index";

//const hostinger = "https://samuelengineer.com";

const http_response_code: objectKeys<number> = {
  GET_ALL: 201,
  POST: 202,
  PUT: 203,
  DELETE: 204,
  DELETE_ALL: 204,
};

export async function apifetch(query: { action: string }) {
  const data = new FormData();
  data.append("json", JSON.stringify(query));

  return fetch(`backend/routes/events.api.php`, {
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
        //        console.error(
        //          `response code ${res.status} isn't allowed, see: http_response_code table`
        //        );
        return false;
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        //	console.log("Success fetch");
        //	console.log(res);
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
      //      console.error(`Error ${err.name} at apifetch: ${err.message}`);
      alert("Error No internet connection");
      return false;
    });
}
