import { Route } from "wouter";
import Board from "./pages/board";

export default function ()
{
    return (
        <Route path="/board/:user">{({user}) => Board({user})}</Route>
    )
}