import { useLocation } from "wouter";

export default function ( {user} : jh.RouteParams ) {

    const [location, setLocation] = useLocation();
    console.log("BOARD", location)

    return <a onClick={() => setLocation(`/backoffice/${user}`)}>Click to update</a>
}
