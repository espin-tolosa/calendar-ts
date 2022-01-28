import React from "react";
import ReactDOM from "react-dom";
import "@/index.css";
import App from "./App";
import { UserLoggedContext } from "@/hooks/useToken";

ReactDOM.render(
  <React.StrictMode>
    <UserLoggedContext>
      <App />
    </UserLoggedContext>
  </React.StrictMode>,
  document.getElementById("root")
);
