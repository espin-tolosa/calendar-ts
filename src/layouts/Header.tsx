import * as tw_Layouts from "@/layouts/tw";
import { Topnav } from "@/components/Topnav/main";
import React from "react";
import {
  useLocalUserPreferences,
  useLocalUserPreferencesContext,
} from "@/hooks/useLocalUserPreferences";

interface isetstate {
  setToogle: React.Dispatch<{ type: string }>;
}

export const LayoutHeader = () => {
  const { dispatchLocalState } = useLocalUserPreferencesContext();
  return (
    <tw_Layouts.TWheader
      onClick={() => dispatchLocalState({ type: "toggleController" })}
    >
      <Topnav />
    </tw_Layouts.TWheader>
  );
};
