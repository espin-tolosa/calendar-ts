import { useLocation } from "wouter";
import type { RouteParams } from "../domain";

export default function ({user}: RouteParams) {
  const [location, setLocation] = useLocation();

  return (
    <div>
      {`The current page is: ${user}`}
      {
        <a onClick={() => setLocation(`/board/${user}`)}>Click to update</a>
      }
    </div>
  );
};
