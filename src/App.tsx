import { Route } from "wouter";
import * as tw_Layouts from "./layouts/tw";
import { Settings } from "./layouts/Settings";
import { Board } from "./layouts/Board";
import { TopBar } from "./components/TopBar/main";

function BoardRoute ({user}:{user:string})
{
    const Layout = () => (
        [
            <TopBar key="topbar" user={user} />,
            <Board key="board" />
        ]

    )
    return (
        <>
            {Layout()}
        </>
    )
}

export function App()
{
    
   
    return (

        <tw_Layouts.TWapp id={"app"}>
      
            <Route path="/board/:name">
            {
                ({name}) => BoardRoute({user:name})
            }
            </Route>
    
            <Route path="/settings" component={Settings} />
    
        </tw_Layouts.TWapp>
    );
}

