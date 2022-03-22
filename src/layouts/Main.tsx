import { LayoutMaster } from "@/layouts/Master";
import { LayoutHeader } from "@/layouts/Header";
import * as tw_Layouts from "@/layouts/tw";
import { useTemporaryEvent } from "@/globalStorage/temporaryEvents";

export const LayoutMain = () => {
  const temporaryEvent = useTemporaryEvent();

  return (
    <>
      <tw_Layouts.TWapp $disableScroll={temporaryEvent.id !== 0} id={"app"}>
        {/*header-layout*/}
        <LayoutHeader />

        {/*main-layout: layout-grid*/}
        <LayoutMaster />
      </tw_Layouts.TWapp>
    </>
  );
};
