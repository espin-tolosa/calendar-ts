import { Route, Switch } from "wouter";
import Board from "./board";
import Backoffice from "./backoffice"

export default function ()
{
    return (
        <Switch>
            <Route path="/board/:user">{({user}) => Board({user})}</Route>
            <Route path="/backoffice/:user">{({user}) => Backoffice({user})}</Route>
        </Switch>
    )
}