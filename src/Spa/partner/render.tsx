import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContextualPartnerApp } from "./context";

const root = window.document.getElementById("partner") as HTMLDivElement;
createRoot(root).render(
    <StrictMode>
        <ContextualPartnerApp/>
    </StrictMode>    
);