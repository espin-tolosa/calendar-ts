import { Header } from "@layouts/tw";
import { setstate } from "@interfaces/index";
import { Container, Logo, Title, Logout } from "@components/Topnav/tw";

type setBoolState = { setDisplayController: setstate<boolean> };

export const HeaderLayout = ({ setDisplayController }: setBoolState) => {
  return (
    <Header onClick={() => setDisplayController((prev) => !prev)}>
      {/*header*/}
      <Container>
        {/*left-header*/}
        <Logo>JH Diary</Logo>
        {/*center-header*/} <Title>Friday, 21 January 2022</Title>
        {/*right-header*/}
        <Logout
          title={"Cleans up your session token | Ctrl+Alt+q"}
          onClick={(evt) => {
            evt.stopPropagation();
          }}
        >
          Logout
        </Logout>
      </Container>
    </Header>
  );
};
