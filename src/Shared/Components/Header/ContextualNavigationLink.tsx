import { Link, Route } from "wouter";
import * as Tailwind from "./tw";

export function ContextualNavigationLink()
{
    return (
        <>
            <Route path="/board/:user">{({user}) => <NavigationLink page="settings" user={user}/> }</Route>
            <Route path="/backoffice/:user">{({user}) => <NavigationLink page="board" user={user}/> }</Route>
        </>
  );
}

export function NavigationLink ( {page, user} : {page: jh.SpaPages, user: string})
{
    return (
        <Link href={`/${page}/${user}`}>
            <Tailwind.logout title={`Go to ${page}`}>
                {page}
            </Tailwind.logout>
        </Link>
    )
}