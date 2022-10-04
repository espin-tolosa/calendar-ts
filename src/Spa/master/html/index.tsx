import { Route, Switch } from "wouter";
import Board from "./pages/board";
import Settings from "./pages/backoffice"
import { App } from "@/Calendar/App";

export default function ()
{
    return (
        <App/>
    )
}