import * as tw_Layouts from "@/layouts/tw";
import { CreateEvent } from "@/components/Controller/main";

interface display {
  display: boolean;
}
export const LayoutController = ({ display }: display) => {
  return (
    <tw_Layouts.TWcontroller $display={display}>
      <CreateEvent />
    </tw_Layouts.TWcontroller>
  );
};
