const domain =
  import.meta.env.MODE === "development" ? "http://192.168.1.141" : "";

const routes = "backend/routes";
const pathGenerator = (point: string, ext = "api.php") =>
  `${domain}/${routes}/${point}.${ext}`;

export const api = {
  routes: {
    login: pathGenerator("login"),
    events: pathGenerator("events"),
    clients: pathGenerator("client_styles"),
    styles: pathGenerator("client_styles_css"),
  },
};
