import { loginForm } from "../interfaces";
import { DocumentIO } from "../window/cookie";

export function fetchLogin(payload: { user: string; password: string }) {
  const data = new FormData();
  data.append("json", JSON.stringify(payload));

  //TODO: Remove fetchLogin
  fetch("", {
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
