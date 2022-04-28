import { loginForm } from "@/interfaces";
import { api } from "@/static/apiRoutes";
import { deleteCookies } from "@/window/cookie/deleteAllCookies";

export function fetchLogin(payload: any) {
  const data = new FormData();
  data.append("json", JSON.stringify(payload));

  fetch(api.routes.login, {
    method: "POST",
    body: data,
  })
    .then((res) => {
      if (res.status !== 201) {
        throw Error(`Error code: ${res.status}`);
      }
    })
    .catch(() => {
      deleteCookies();
    });
}

export function clearLogin() {
  const nullForm: loginForm = { user: "", password: "" };
  fetchLogin(nullForm);
}
