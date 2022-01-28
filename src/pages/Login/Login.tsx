import { useForm } from "react-hook-form";
import { TWloginButton, TWloginForm, TWloginInput, TWloginWrapper } from "./tw";

export default function Login(props: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fakeLogin = (user: string, password: string) => {
    if (user === "samuel" && password === "freesolo") {
      return true;
    } else {
      return false;
    }
  };

  function onSubmitLogin(payload: any) {
    console.log("payload", payload);
    fakeLogin(payload.user, payload.password) && props.setIsLogged(true);
    // const data = new FormData();
    // data.append("json", JSON.stringify(payload));

    // fetch("/backend/routes/login.api.php", {
    //   method: "POST",
    //   body: data,
    // }).then((res) => {
    //   if (res.status === 200) {
    //     props.setIsLogged((prev: any) => !prev); //condition to render the Calendar View (ref: ad52)
    //   }
    // });
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
