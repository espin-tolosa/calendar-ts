import { useState } from "react";
import { CreateEvent } from "@/components/Controller/main";
import * as tw_Layouts from "@/layouts/tw";
import { Topnav } from "@/components/Topnav/main";
import { LayoutBoard } from "@/layouts/Board";

export default function App(): JSX.Element {
  const [toogleCreate, setToogleCreate] = useState(false);

  return (
    <>
      {/*App*/}
      <tw_Layouts.TWapp>
        {/*header-layout*/}
        <tw_Layouts.TWheader onClick={() => setToogleCreate((prev) => !prev)}>
          {/*header*/}
          <Topnav />
        </tw_Layouts.TWheader>

        {/*main-layout: layout-grid*/}
        <tw_Layouts.TWmain $display={toogleCreate}>
          {/*controller-layout*/}
          <tw_Layouts.TWcontroller $display={toogleCreate}>
            <CreateEvent />
          </tw_Layouts.TWcontroller>

          {/*calendar-layout*/}
          {/*calendar*/}
          <LayoutBoard />
        </tw_Layouts.TWmain>
      </tw_Layouts.TWapp>
    </>
  );
}
