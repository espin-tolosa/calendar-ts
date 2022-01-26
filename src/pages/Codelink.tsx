import { useState } from "react";
import * as tw_Layouts from "@/layouts/tw";
import { Topnav } from "@/components/Topnav/main";
import { LayoutMaster } from "@/layouts/Master";
import { LayoutHeader } from "@/layouts/Header";

export default function App(): JSX.Element {
  const [toogleCreate, setToogleCreate] = useState(false);

  return (
    <>
      {/*App*/}
      <tw_Layouts.TWapp>
        {/*header-layout*/}
        <LayoutHeader setToogle={setToogleCreate} />

        {/*main-layout: layout-grid*/}
        <LayoutMaster display={toogleCreate} />
      </tw_Layouts.TWapp>
    </>
  );
}
