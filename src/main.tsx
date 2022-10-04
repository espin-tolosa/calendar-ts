import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./apps/App";

const root = window.document.getElementById("root") as HTMLDivElement;

createRoot(root).render(
    <StrictMode>
        <App/>
    </StrictMode>
);