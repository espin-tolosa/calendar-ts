import { Route, Switch } from "wouter";
import Board from "./pages/board";
import Backoffice from "./pages/backoffice"

export default function ()
{
    return (
        <Switch>
            <Route path="/board/:user">{({user}) => Board({user})}</Route>
            <Route path="/backoffice/:user">{({user}) => Backoffice({user})}</Route>
        </Switch>
    )
}