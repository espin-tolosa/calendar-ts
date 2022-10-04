import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContextualPartnerApp } from "./context";
import "../../Assets/index.css";

const root = window.document.getElementById("partner") as HTMLDivElement;
createRoot(root).render(
    <StrictMode>
        <ContextualPartnerApp/>
    </StrictMode>    
);