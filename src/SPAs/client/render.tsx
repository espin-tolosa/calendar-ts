import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContextualClientApp } from "./context";
import "../../html-assets/index.css";

const root = window.document.getElementById("client") as HTMLDivElement;
createRoot(root).render(
    <StrictMode>
        <ContextualClientApp/>
    </StrictMode>    
);