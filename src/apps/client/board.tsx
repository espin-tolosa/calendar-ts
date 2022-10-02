import type { RouteParams } from "../domain";

export default function ({user}:RouteParams) {
    console.log("Client")
    return <div>`Client ${user}`</div>;
}
