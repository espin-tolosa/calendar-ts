import * as tw_Layouts from "@/layouts/tw";
import { CreateEvent } from "@/components/Controller/main";

import { useLocalUserPreferencesContext } from "@/hooks/useLocalUserPreferences";
export const LayoutController = () => {
  const { localState } = useLocalUserPreferencesContext();
  console.log(
    "Displaycontroller from localState",
    localState.displayController
  );
  return (
    <tw_Layouts.TWcontroller $display={localState.displayController}>
      <CreateEvent />
    </tw_Layouts.TWcontroller>
  );
};
