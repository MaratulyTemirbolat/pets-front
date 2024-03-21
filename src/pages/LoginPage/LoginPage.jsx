// Styles
import "./LoginPage.scss";

// Components
import Button from "../../components/shared/Buttons/Button";
import PasswordInput from "../../components/shared/Inputs/PasswordInput";

// External
import { useForm } from "react-hook-form";
import { useUserStore } from "../../store/user.store";
import { loginUser } from "../../services/auths.service";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [user, setUser, setAccessToken, isExistedAccessToken] = useUserStore((state) => [
    state.user,
    state.setUser,
    state.setAccessToken,
    state.isExistedAccessToken,
  ]);

  const onSubmit = (data) => {
    loginUser(data)
      .then((res) => {
        if (res.isOk) {
          setUser(res.response);
          setAccessToken(res.response["access"]);
          navigate("/");
        } else {
          for (const [key, value] of Object.entries(res.response.response)) {
            setError(key, {
              type: "custom",
              message: res.response.response[key][0],
            });
          }
        }
      })
      .catch((reas) => alert(reas));
  };


  useEffect(() => {
    if (isExistedAccessToken()) navigate("/");
  }, []);

  return (
    <div id="login__container">
      <div id="form__container">
        <div className="form__content">
          <div className="title__wrapper">
            <h1 className="form__title">Login</h1>
          </div>
          <form method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="inputs">
              <div className="form__row">
                <div className="input__wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="example@example.com"
                    {...register("email", { required: true })}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="input__wrapper">
                  <PasswordInput
                    name="password"
                    placeholder="Password"
                    register={register}
                    handleEventChange={(e) => {
                      console.log("Password", e);
                    }}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="error__msg" style={{ color: "red" }}>
                  {errors.email?.message && (
                    <span className="login__page__error">
                      {errors.email?.message}
                    </span>
                  )}
                  {errors.password?.message && (
                    <span className="login__page__error">
                      {errors.password?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="enter__btn">
              <Button text="Login" isEnable={true} handleSuccess={() => {}} />
            </div>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const credentialResponseDecoded = jwtDecode(
                  credentialResponse.credential
                );
                onSubmit({
                  email: credentialResponseDecoded["email"],
                  password: credentialResponse["clientId"],
                });
              }}
              onError={(err) => {
                console.log("Error", err);
              }}
            />
            <div className="form__footer">
              Don't have аn account?
              <a
                id="user__agreement"
                href="/register"
                style={{ textDecoration: "none" }}
              >
                Register
              </a>
            </div>
          </form>
        </div>
      </div>
      {/* {modal && <ModalAgreement handleModal={handleModal}/>} */}
    </div>
  );
}

export default LoginPage;
