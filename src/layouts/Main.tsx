import { LayoutMaster } from "@/layouts/Master";
import { LayoutHeader } from "@/layouts/Header";
import * as tw_Layouts from "@/layouts/tw";
import tw from "tailwind-styled-components";
import { useEffect, useState } from "react";

export const LayoutMain = () => {
  const [tela, setTela] = useState(true);
  const [tela2, setTela2] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setTela(false);
    }, 100);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setTela2(false);
    }, 500);
  }, []);
  const Tela = tw.div<{ $display: boolean; $hidde: boolean }>`
${({ $display }) =>
  ($display && "bg-slate-400") || (!$display && "h-[1px] bg-slate-400") || ""}	
${({ $hidde }) => ($hidde && "") || (!$hidde && "hidden") || ""}	
	absolute w-full h-[200vh] z-50 transition-all
	`;
  return (
    <>
      <Tela $display={tela} $hidde={tela2} />
      <tw_Layouts.TWapp>
        {/*header-layout*/}
        <LayoutHeader />

        {/*main-layout: layout-grid*/}
        <LayoutMaster />
      </tw_Layouts.TWapp>
    </>
  );
};
