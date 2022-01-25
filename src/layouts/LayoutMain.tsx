import { BoardLayout } from "@layouts/Board";
import { ControllerLayout } from "@layouts/Controller";
import { Main } from "./tw";

export const MainLayout = ({ display }: { display: boolean }) => {
  return (
    <Main display={display}>
      {/*controller-layout*/}
      <ControllerLayout display={display} />

      {/*calendar-layout*/}
      <BoardLayout />
    </Main>
  );
};
