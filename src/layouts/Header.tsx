import * as tw_Layouts from "@/layouts/tw";
import { Topnav } from "@/components/Topnav/main";
import { setstate } from "@/interfaces";

interface isetstate {
  setToogle: setstate<boolean>;
}

export const LayoutHeader = ({ setToogle }: isetstate) => {
  return (
    <tw_Layouts.TWheader onClick={() => setToogle((prev) => !prev)}>
      <Topnav />
    </tw_Layouts.TWheader>
  );
};
