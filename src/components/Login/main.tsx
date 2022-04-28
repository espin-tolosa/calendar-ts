import { TWloginButton, TWloginForm, TWloginInput, TWloginWrapper } from "./tw";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useListenWindowSize } from "@/hooks/useResponsiveLayout";
import { clearLogin, fetchLogin } from "@/window/fetch/login";

export default function Login() {
  const { register, handleSubmit, formState } = useForm();
  const isLargeWindow = useListenWindowSize();

  useEffect(() => {
    clearLogin();
  }, []);

  const onSubmitLogin = (payload: any) => {
    //TODO: fix any, understand handleSubmit
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
        {formState.errors.user && <p>User is required.</p>}
        {formState.errors.password && <p>Password is required.</p>}
      </TWloginForm>
    </TWloginWrapper>
  );
}
