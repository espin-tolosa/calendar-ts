import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, useLocation } from "wouter";
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
        <Route path="/">
            <Index/>
        </Route>
    </StrictMode>
);

function Index()
{
    const [location, setLocation] = useLocation();

    return (
        <ul>
            <li onClick={() => setLocation("/board/samuel")}>Go to board/samuel</li>
            <li onClick={() => setLocation("/settings/james")}>Go to settings/samuel</li>
        </ul>

    )

}