// In development component, intended to show notifications to the user, such as:
// error fetching, update in process, not logged, etc.

// The design is not yet decided, I'm thinking in two options, first:
// 1. a little modal displayed downside the Topnav
// 2. a message train showing the text withing the Topnav itself

// Both cases the component has the capacity to desapear by itself after a defined period of time

import { useEffect, useState } from "react";

export const Notifications = ({ message }: { message: string }) => {
  //TODO: change to action has to unmount

  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 5000);
  }, []);

  return show ? (
    <div className="sticky top-w-50  w-full h-full bg-slate-200 ">
      {message}
    </div>
  ) : (
    <div className="sticky top-w-50  w-0 h-0 bg-transparent ">{message}</div>
  );
};
