import { LayoutMaster } from "@/layouts/Master";
import { LayoutHeader } from "@/layouts/Header";
import * as tw_Layouts from "@/layouts/tw";
import { useKeyboardShortcuts } from "@/hooks/useKeyListeners";

export const LayoutMain = () => {
  useKeyboardShortcuts();
  return (
    <tw_Layouts.TWapp id={"app"}>
      {/*header-layout*/}
      <LayoutHeader />

      {/*main-layout: layout-grid*/}
      <LayoutMaster />
    </tw_Layouts.TWapp>
  );
};
