import * as tw_Layouts from "@/layouts/tw";
import { LayoutController } from "@/layouts/Controller";
import { LayoutBoard } from "@/layouts/Board";
interface display {
  display: boolean;
}
export const LayoutMaster = ({ display }: display) => {
  console.log("passing display", display);
  return (
    <tw_Layouts.TWmain $display={display}>
      <LayoutController display={display} />

      <LayoutBoard />
    </tw_Layouts.TWmain>
  );
};
