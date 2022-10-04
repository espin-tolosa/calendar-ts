export default function ( {user} : jh.RouteParams ) {
    console.log("Client")
    return <div>`Client ${user}`</div>;
}
