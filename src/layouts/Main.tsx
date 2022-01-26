import { useState, useReducer } from "react";
import { LayoutMaster } from "@/layouts/Master";
import { LayoutHeader } from "@/layouts/Header";
import * as tw_Layouts from "@/layouts/tw";

const initState = { display: true };

function reducer(state: { display: boolean }) {
  return { display: !state.display };
}

export const LayoutMain = () => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <tw_Layouts.TWapp>
      {/*header-layout*/}
      <LayoutHeader setToogle={dispatch} />

      {/*main-layout: layout-grid*/}
      <LayoutMaster display={state.display} />
    </tw_Layouts.TWapp>
  );
};
