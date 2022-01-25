import * as tw_Layouts from "@layouts/tw";
import { CreateEvent } from "@components/Controller/main";

export const ControllerLayout = ({ display }: { display: boolean }) => {
  return (
    <tw_Layouts.controller $display={display}>
      <CreateEvent />
    </tw_Layouts.controller>
  );
};
