import { Route } from "wouter";
import * as tw_Layouts from "./layouts/tw";
import { Settings } from "./layouts/Settings";
import { Board } from "./layouts/Board";
import { TopBar } from "./components/TopBar/main";


export function App()
{
    return (
        <tw_Layouts.TWapp id={"app"}>
      
      
            <Route path="/board/:name">
            {(params) => {
                return (
                    <>
                        <TopBar user={params.name} />
                        <Board/>
                    </>
                )
                }}
            </Route>
      <Route path="/settings" component={Settings} />
    </tw_Layouts.TWapp>
  );
}

