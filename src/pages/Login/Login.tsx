import { useUserSession } from "@/hooks/useUserSession";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TWloginButton, TWloginForm, TWloginInput, TWloginWrapper } from "./tw";
import { useListenWindowSize } from "@/hooks/useResponsiveLayout";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { fetchLogin, clearLoginSession } = useUserSession();

  useEffect(() => {
    clearLoginSession();
  }, []);

  const isLargeWindow = useListenWindowSize();

  const onSubmitLogin = (payload: any) => {
    //TODO: fix any, understand handleSubmit
    //fakeLogin(payload);
    if (document.fullscreenEnabled && !isLargeWindow) {
      document.documentElement.requestFullscreen().then((res) => {
        fetchLogin(payload);
      });
    } else {
      fetchLogin(payload);
    }
  };
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
