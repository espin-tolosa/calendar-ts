import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContextualClientApp } from "./apps/App";

const root = window.document.getElementById("client") as HTMLDivElement;

createRoot(root).render(
    <StrictMode>
        <ContextualClientApp/>
    </StrictMode>
);