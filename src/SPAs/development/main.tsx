import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContextualClientApp } from "../client/context";
import { ContextualMasterApp } from "../master/context";
import { ContextualPartnerApp } from "../partner/context";

const type = import.meta.env.MODE;

const DefaultApp = () => (
    <h1>
        Error: Development mode has not choose proper value for VITE_TARGET_USER
        <ul>
            <li>master</li>
            <li>partner</li>
            <li>client</li>
        </ul>
    </h1>
)

const App =
    type === "master" ? ContextualMasterApp :
    type === "partner" ? ContextualPartnerApp :
    type === "client" ? ContextualClientApp :
    DefaultApp;

const root = window.document.getElementById("root") as HTMLDivElement;
createRoot(root).render(
    <StrictMode>
        <App/>
    </StrictMode>
);