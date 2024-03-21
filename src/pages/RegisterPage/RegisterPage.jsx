// Styles
import "./RegisterPage.scss";

// Components
import PasswordInput from "../../components/shared/Inputs/PasswordInput";
import Button from "../../components/shared/Buttons/Button";

// External
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auths.service"
import { useUserStore } from "../../store/user.store";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


function RegisterPage() {

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
      registerUser(data).then((res) => {
        if (res.isOk) {
          setUser(res.response);
          setAccessToken(res.response["access"]);
          navigate("/");
        } else {
          console.log(res);
          for (const [key, value] of Object.entries(res.response.response)) {
            console.log(`${key}: ${value}`);
            setError(
              key,
              {
                type: "custom",
                message: res.response.response[key][0]
              }
            )
          }
        }
      }).catch((reason) => alert(reason));
    };
    useEffect(() => {
      if (isExistedAccessToken()) navigate("/");
    }, []);

  return (
    <>
      <div id="login__container">
        <div id="form__container">
          <div className="form__content">
            <div className="title__wrapper">
              <h1 className="form__title">Registration</h1>
            </div>
            <form method="post" onSubmit={handleSubmit(onSubmit)}>
              <div className="inputs">
                <div className="reg__form__row">
                  <div className="reg__input__description">
                    <label className="reg__input__label">
                      Email
                    </label>
                    {errors.email && <div className="reg__input__error">{errors.email?.message}</div>}
                  </div>
                  <div className="input__wrapper">
                      <input
                        name="email"
                        type="email"
                        placeholder="example@example.com"
                        required
                        {...register("email", { required: true })}
                      />
                  </div>
                </div>
                <div className="reg__form__row">
                  <div className="reg__input__description">
                    <label className="reg__input__label">
                      First name
                    </label>
                    {errors.first_name && <div className="reg__input__error">This is required field</div>}
                  </div>
                  <div className="input__wrapper">
                      <input
                        name="first_name"
                        type="text"
                        placeholder="Temirbolat"
                        required
                        {...register("first_name", { required: true })}
                      />
                  </div>
                </div>
                <div className="reg__form__row">
                  <div className="reg__input__description">
                    <label className="reg__input__label">
                      Last name
                    </label>
                    {errors.last_name && <div className="reg__input__error">This is required field</div>}
                  </div>
                  <div className="input__wrapper">
                      <input
                        name="last_name"
                        type="text"
                        placeholder="Maratuly"
                        required
                        {...register("last_name", { required: true })}
                      />
                  </div>
                </div>
                <div className="reg__form__row">
                  <div className="reg__input__description">
                    <label className="reg__input__label">
                      Password
                    </label>
                    {errors.password && <div className="reg__input__error">This is required field</div>}
                  </div>
                  <div className="input__wrapper">
                      <PasswordInput
                        register={register}
                        name="password"
                        placeholder="Password"
                        handleEventChange={() => {
                            console.log("Password", e);
                        }}
                      />
                  </div>
                </div>
                {/* <div className="reg__form__row">
                  <div className="reg__input__description">
                    <label className="reg__input__label">Кем вы будете</label>
                    <div className="reg__input__error"></div>
                  </div>
                  <div className="input__wrapper" id="last_reg_wrapper">
                    <select name="position" id="position">
                      <option value="student">Студент</option>
                      <option value="teacher">Преподаватель</option>
                    </select>
                  </div>
                </div> */}
              </div>
              <div className="enter__btn">
                <Button
                  isEnable={true}
                  text={"Register"}
                  handleSuccess={() => {}}
                />
              </div>
              <GoogleLogin
              onSuccess={(credentialResponse) => {
                const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                console.log(credentialResponseDecoded);
                console.log(credentialResponse);
                onSubmit({
                  "email": credentialResponseDecoded["email"],
                  "first_name": credentialResponseDecoded["given_name"],
                  "last_name": credentialResponseDecoded["family_name"],
                  "password": credentialResponse["clientId"],
                });
              }}
              onError={(err) => {
                console.log("Error", err);
              }}
            />
              <div className="form__footer">
                Already have an account ?
                <a href="/login" id="user__agreement">
                  Authorize
                </a>
              </div>
            </form>
          </div>
        </div>
        {/* {modal && <ModalAgreement handleModal={handleModal} />} */}
      </div>
    </>
  );
}

export default RegisterPage;
