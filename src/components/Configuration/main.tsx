import { useMemo, useState } from "react";
import * as tw_Controller from "./tw";

import tw from "tailwind-styled-components/dist/tailwind";
import { useConfigColumns, useListenWindowSize } from "./hook";

export function Configuration() {
  const [columns, errorMsg, hChangeColumns] = useConfigColumns();
  const isLargeWindow = useListenWindowSize();

  if (!isLargeWindow) {
    return <></>;
  }

  return (
    <>
      <tw_Controller.form>
        <div className="grid grid-cols-2 gap-2">
          <div>Columns</div>
          <div className="flex flex-row justify-center">
            <TW_button
              type="button"
              className="rounded-l-full"
              $display={columns > 1}
              onClick={() => hChangeColumns(-1) as any}
            >
              -
            </TW_button>
            <div className="bg-slate-200 w-10 text-center">{columns}</div>

            <TW_button
              className="rounded-r-full"
              $display={columns < 4}
              type="button"
              onClick={() => hChangeColumns(1) as any}
            >
              +
            </TW_button>
          </div>
        </div>
        <div className="text-xs text-red-900 ">{errorMsg}</div>
      </tw_Controller.form>
    </>
  );
}

const TW_button = tw.button<{ $display: boolean }>`
                 w-8 hover:bg-slate-400 transition-colors

  ${({ $display }) =>
    ($display && "bg-slate-200") ||
    (!$display && "text-slate-400 bg-slate-100 ") ||
    ""}
`;
