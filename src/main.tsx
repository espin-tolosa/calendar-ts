import React from "react";
import ReactDOM from "react-dom";
import "@/index.css";
import App from "./App";
import { UserSession } from "@/hooks/useUserSession";

ReactDOM.render(
  <React.StrictMode>
    <UserSession>
      <App />
    </UserSession>
  </React.StrictMode>,
  document.getElementById("root")
);
