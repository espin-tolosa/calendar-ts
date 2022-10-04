import { Route, Switch } from "wouter";
import Board from "./pages/board";
import Settings from "./pages/backoffice"

export default function ()
{
    return (
        <Switch>
            <Route path="/board/:user">{({user}) => Board({user})}</Route>
            <Route path="/settings/:user">{({user}) => Settings({user})}</Route>
        </Switch>
    )
}