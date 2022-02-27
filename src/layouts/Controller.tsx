import { TWcontroller } from "./tw";
import { CreateEventMemo } from "@/components/Controller/main";
import { Configuration } from "@/components/Configuration/main";
import { useLocalUserPreferencesContext } from "@/hooks/useLocalUserPreferences";

export const LayoutController = () => {
  const { displayController } = useLocalUserPreferencesContext().localState;

  return (
    <TWcontroller id={"Controller"} $display={displayController}>
      <CreateEventMemo />
      <Configuration />
    </TWcontroller>
  );
};
