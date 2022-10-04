import { TWflexColLayout } from "../tw";

export function MonthLayout({print, children}:{print: boolean, children: JSX.Element[] })
{
    const attributes = {
        "$toPrint": print,
        "title": "Double click here to print this month",
    }

    return (

        <TWflexColLayout {...attributes} > {children}
        </TWflexColLayout>
    )
}