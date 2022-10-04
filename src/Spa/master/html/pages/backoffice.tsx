import { Link } from "wouter";

export default function ( {user} : jh.RouteParams ) {
  //const [location, setLocation] = useLocation();

  return (
    <Link href={`/board/${user}`}>
        <a className="link">Go to Board</a>
    </Link>

  );
};
