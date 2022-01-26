import { TWboard } from "./tw";
import { Month } from "@/components/Month/main";
import * as initEvent from "@/static/initEvents";
export const LayoutBoard = () => {
  return (
    <TWboard>
      <Month events={initEvent.month1} />
      <Month events={initEvent.month2} />
      <Month events={initEvent.month1} />
    </TWboard>
  );
};
