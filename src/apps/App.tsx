import IsolatedMasterApp  from "./master/index"
import IsolatedPartnerApp from "./partner/index";
import IsolatedClientApp from "./client/index"

/**
 * App file:
 * 
 * This file collects all apps under the same route and shows only one to main file,
 * which is the one that will be compiled. The Apps find here a place to locate all
 * React context provider they need to work.
 */

const target = import.meta.env.VITE_TARGET_USER;

export const App =
target === "master" ? ContextualMasterApp :
target === "partner" ? ContextualPartnerApp :
target === "client" ? ContextualClientApp :
ContextualDefaultApp;

// App Master provides contexts
function ContextualMasterApp() {
    return (
        <>
            <IsolatedMasterApp/>
        </>
    );
}

function ContextualPartnerApp() {
    return (
        <>
            <IsolatedPartnerApp/>
        </>
    );
}

function ContextualClientApp() {
    return (
        <>
            <IsolatedClientApp/>
        </>
    );
}

function ContextualDefaultApp() {
    return <p>User Target is not choosen on .env, options are: master, partner, client</p>
}