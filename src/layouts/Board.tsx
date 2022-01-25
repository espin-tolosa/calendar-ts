import * as tw_Layouts from "@layouts/tw";
import { Month } from "@components/Month/main";
import * as initEvent from "@static/initEvents";

export const BoardLayout = () => {
  return (
    <tw_Layouts.board>
      <Month events={initEvent.month1} />
      <Month events={initEvent.month2} />
      <Month events={initEvent.month1} />
    </tw_Layouts.board>
  );
};
