import { Route } from "wouter";
import Board from "./board";

export default function ()
{
    return (
        <Route path="/board/:user">{({user}) => Board({user})}</Route>
    )
}