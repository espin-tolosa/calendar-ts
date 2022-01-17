import React from "react";
import ReactDOM from "react-dom";
import "@/index.css";
//import App from "@/App";
import App from "./pages/Codelink";
import StyledCalendar from "./Styled-Calendar";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
