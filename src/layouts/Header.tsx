import * as tw_Layouts from "@/layouts/tw";
import { Topnav } from "@/components/Topnav/main";
import { setstate } from "@/interfaces";
import React from "react";

interface isetstate {
  setToogle: React.DispatchWithoutAction;
}

export const LayoutHeader = ({ setToogle }: isetstate) => {
  return (
    <tw_Layouts.TWheader onClick={() => setToogle()}>
      <Topnav />
    </tw_Layouts.TWheader>
  );
};
