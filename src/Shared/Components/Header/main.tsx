import { GetTodayDateFormat } from "@/Shared/Utilities/DateService";
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
                <div>
                {/*right-header*/}
                    {/*<BackofficeButton />*/}
                    <Tailwind.logout title={"Cleans up your session token | Ctrl+Alt+q"}
                    //    onClick={(e) => {e.stopPropagation(); window.location.href ="/logout";}}
                    >
                        Logout
                    </Tailwind.logout>
                </div>
            </Tailwind.container>
        </Tailwind.header>
    )

}