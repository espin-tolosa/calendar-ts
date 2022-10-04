import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContextualPartnerApp } from "./apps/App";

const root = window.document.getElementById("partner") as HTMLDivElement;

createRoot(root).render(
    <StrictMode>
        <ContextualPartnerApp/>
    </StrictMode>
);