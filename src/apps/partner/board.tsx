import type { RouteParams } from "../domain";

export default function ({user}:RouteParams) {
    return <div>`Partner: ${user}`</div>;
}
