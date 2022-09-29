import { ProcessEnv } from "../classes/ProcessEnv";
import { Routes } from "../classes/Routes";

const myEnv = new ProcessEnv(import.meta.env);
const myLoc = window.location;
const myPath = new URL(myLoc.toString());

export const apiRoutes = new Routes(myEnv, myPath);