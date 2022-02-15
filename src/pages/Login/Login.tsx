import { useUserSession } from "@/hooks/useUserSession";
import { useForm } from "react-hook-form";
import { TWloginButton, TWloginForm, TWloginInput, TWloginWrapper } from "./tw";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fakeLogin = (user: string, password: string) => {
    if (
      (user === "samuel" && password === "freesolo") ||
      (user === "thomas" && password === "admin") ||
      (user === "james" && password === "admin")
    ) {
      return true;
    } else {
      return false;
    }
  };

  const session = useUserSession();

  function onSubmitLogin(payload: any) {
    //fakeLogin(payload.user, payload.password) && session.dispatch(true);
    const data = new FormData();
    data.append("json", JSON.stringify(payload));

    fetch("/backend/routes/login.api.php", {
      method: "POST",
      body: data,
    }).then((res) => {
      if (res.status === 200) {
        session.dispatch(true); //condition to render the Calendar View (ref: ad52)
      } else {
        console.warn("unable to connect Login");
      }
    });
  }
  return (
    <TWloginWrapper>
      <TWloginForm onSubmit={handleSubmit(onSubmitLogin)}>
        <TWloginInput
          type="text"
          placeholder="User"
          {...register("user", { required: true })}
        />

        <TWloginInput
          type="password"
          placeholder="Password"
          autoComplete="on"
          {...register("password", { required: true })}
        />

        <TWloginButton type="submit" value="Login">
          Login{" "}
        </TWloginButton>
        {errors.user && <p>User is required.</p>}
        {errors.password && <p>Password is required.</p>}
      </TWloginForm>
    </TWloginWrapper>
  );

  /*
  return (
    <TWlogin.loginWrapper >
      <StyledLogin.Form onSubmit={handleSubmit(onSubmitLogin)}>
        <StyledLogin.Input
          type="text"
          placeholder="User"
          {...register("user", { required: true })}
        />
        <StyledLogin.Input
          type="password"
          placeholder="Password"
          autoComplete="on"
          {...register("password", { required: true })}
        />

        <StyledLogin.Button type="submit" value="Login">
          Login{" "}
        </StyledLogin.Button>
        {errors.user && <p>User is required.</p>}
        {errors.password && <p>Password is required.</p>}
      </StyledLogin.Form>
    </StyledLogin.Wrapper>
  );
*/
}
