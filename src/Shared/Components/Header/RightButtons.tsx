import { ContextualNavigationLink, NavigationLink } from "./ContextualNavigationLink";

export function RightButtonsBase(propTypes : {children: JSX.Element})
{
    return (
        <div className="flex gap-1">
            <ContextualNavigationLink/>
            {propTypes.children}
        </div>

    )
}

export function RightButtonsMaster({user} : jh.RouteParams)
{
    return (
        <RightButtonsBase>
            <NavigationLink page="logout" user={user} />
        </RightButtonsBase>

    )
}