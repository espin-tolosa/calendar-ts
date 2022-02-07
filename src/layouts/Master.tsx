import * as tw_Layouts from "@/layouts/tw";
import { LayoutController } from "@/layouts/Controller";
import { LayoutBoard } from "@/layouts/Board";
interface display {
  display: boolean;
}
import { useLocalUserPreferencesContext } from "@/hooks/useLocalUserPreferences";
export const LayoutMaster = () => {
  const { localState } = useLocalUserPreferencesContext();
  return (
    <tw_Layouts.TWmain $display={localState.displayController}>
      <LayoutController />

      <LayoutBoard />
    </tw_Layouts.TWmain>
  );
};
