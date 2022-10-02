import { useLocation } from "wouter";
import { RouteParams } from "../domain";


export default function ({user}:RouteParams ) {

    const [location, setLocation] = useLocation();
    console.log("BOARD", location)

    return <a onClick={() => setLocation(`/backoffice/${user}`)}>Click to update</a>
}
