import { useLocation } from "wouter";

export default function ( {user} : jh.RouteParams ) {
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
