import { ProcessEnv } from "../classes/ProcessEnv";
import { Routes } from "../classes/Routes";

const myEnv = new ProcessEnv(import.meta.env);
const myLoc = window.location;
const myPath = new URL(myLoc.toString());

export const apiRoutes = new Routes(myEnv, myPath);

import.meta.env.DEV && console.info("Running under following env configuration:", myEnv.user, apiRoutes.event)