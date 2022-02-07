import { LayoutMaster } from "@/layouts/Master";
import { LayoutHeader } from "@/layouts/Header";
import * as tw_Layouts from "@/layouts/tw";

export const LayoutMain = () => {
  return (
    <tw_Layouts.TWapp>
      {/*header-layout*/}
      <LayoutHeader />

      {/*main-layout: layout-grid*/}
      <LayoutMaster />
    </tw_Layouts.TWapp>
  );
};

// Note: dispatchLocalState is passed down, so the Reducer function is available there
