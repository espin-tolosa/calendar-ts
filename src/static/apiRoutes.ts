const domain =
  import.meta.env.MODE === "development" ? "http://192.168.1.141" : "";

const routes = "backend/routes";
const pathGenerator = (point: string, ext = "api.php") =>
  `${domain}/${routes}/${point}.${ext}`;

const pathGenerator_v2 = (point: string, prefix = "/api") =>
  `${prefix}/${point}`;

  export const api = {
  routes: {
    login: pathGenerator("login"),
    events: pathGenerator("events"),
    clients: pathGenerator_v2("styles"), //TODO: [moved] client_styles -> styles
    backoffice: {
      styles: pathGenerator("backoffice/styles"),
      addUser: pathGenerator("backoffice/addUser"),
    },
  },
};
