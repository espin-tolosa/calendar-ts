import { loginForm } from "@/interfaces";
import { api } from "@/static/apiRoutes";
import { DocumentIO } from "@/window/cookie";

export function fetchLogin(payload: { user: string; password: string }) {
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
      DocumentIO.deleteAllCookies();
    });
}

export function clearLogin() {
  const nullForm: loginForm = { user: "", password: "" };
  fetchLogin(nullForm);
}
