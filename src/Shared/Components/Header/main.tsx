import { GetTodayDateFormat } from "@/Shared/Utilities/DateService";
import { RightButtonsMaster } from "./RightButtons";
import * as Tailwind from "./tw";

export function Header({user} : jh.RouteParams)
{
    return (

        <Tailwind.header>
            <Tailwind.container>
                <Tailwind.logo>{`JH Diary | ${user.toLocaleUpperCase()}`}</Tailwind.logo>
                <Tailwind.title
                //onClick={() => {
                //    if (monthRef?.current == undefined) {return;}
                //        monthRef?.current?.scrollIntoView({ behavior: "smooth" });
                //    }}
                >
                    {GetTodayDateFormat()}
                </Tailwind.title>
                <RightButtonsMaster user={user}/>
            </Tailwind.container>
        </Tailwind.header>
    )

}