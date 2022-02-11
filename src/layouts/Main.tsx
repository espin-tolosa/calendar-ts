import { LayoutMaster } from "@/layouts/Master";
import { LayoutHeader } from "@/layouts/Header";
import * as tw_Layouts from "@/layouts/tw";
import tw from "tailwind-styled-components";
import { useEffect, useState } from "react";

export const LayoutMain = () => {
  //  const [tela, setTela] = useState(true);
  //  const [tela2, setTela2] = useState(true);
  //  useEffect(() => {
  //    setTimeout(() => {
  //      setTela(false);
  //    }, 1000);
  //  }, []);
  //  useEffect(() => {
  //    setTimeout(() => {
  //      setTela2(false);
  //    }, 2000);
  //  }, []);
  //  const Tela = tw.div<{ $display: boolean; $hidde: boolean }>`
  //	transition ease-out
  //${({ $display }) =>
  //  ($display && "bg-[rgb(100,100,100)]") ||
  //  (!$display && "bg-[rgb(10,10,10)]") ||
  //  ""}
  //${({ $hidde }) => ($hidde && "") || (!$hidde && "hidden") || ""}
  //	absolute w-full h-[200vh]
  //	`;
  return (
    <>
      <tw_Layouts.TWapp>
        {/*header-layout*/}
        <LayoutHeader />

        {/*main-layout: layout-grid*/}
        <LayoutMaster />
      </tw_Layouts.TWapp>
    </>
  );
};
