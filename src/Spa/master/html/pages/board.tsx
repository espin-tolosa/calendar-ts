import { Header } from "../../../../Shared/Components/Header/main";

export default function ( {user} : jh.RouteParams ) {

    return (
        <Header user={user}/>
    )


}
