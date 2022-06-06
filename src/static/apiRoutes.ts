const domain =
  import.meta.env.MODE === "development" ? "http://192.168.1.141" : "";

export const api = {
  routes: {
    login: `${domain}/backend/routes/login.api.php`,
    events: `${domain}/backend/routes/events.api.php`,
  },
};
