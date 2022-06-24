const domain = import.meta.env.MODE === "development" ? "http://localhost" : "";

export const api = {
  routes: {
    login: `${domain}/backend/routes/login.api.php`,
    events: `${domain}/backend/routes/events.api.php`,
  },
};
