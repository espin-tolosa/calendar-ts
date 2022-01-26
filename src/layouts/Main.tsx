import { useState } from "react";
import { LayoutMaster } from "@/layouts/Master";
import { LayoutHeader } from "@/layouts/Header";
import * as tw_Layouts from "@/layouts/tw";

export const LayoutMain = () => {
  const [toogleCreate, setToogleCreate] = useState(false);
  return (
    <tw_Layouts.TWapp>
      {/*header-layout*/}
      <LayoutHeader setToogle={setToogleCreate} />

      {/*main-layout: layout-grid*/}
      <LayoutMaster display={toogleCreate} />
    </tw_Layouts.TWapp>
  );
};
