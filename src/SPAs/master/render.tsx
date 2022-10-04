import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContextualMasterApp } from "./context";
import "../../html-assets/index.css";

const root = window.document.getElementById("master") as HTMLDivElement;
createRoot(root).render(
    <StrictMode>
        <ContextualMasterApp/>
    </StrictMode>    
);