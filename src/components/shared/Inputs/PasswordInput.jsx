// Styles
import "./PasswordInput.scss";

// React
import { useState } from "react";

import closeEyeIcon from "../../../../public/icons/form/close_eye_password.svg";
import openEyeIcon from "../../../../public/icons/form/open_eye_password.svg";

const PasswordInput = (
    {
      register,
      handleEventChange,
      name = "password",
      placeholder = "Введите пароль"
    }
  ) => {
    const [showPassword, setShowPassword] = useState(false);
  
    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
  
    return (
      <>
        <input
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          required
          className="password__input"
          onBlur={e => handleEventChange(e)}
          {...register(name, { required: true })}
        />
        {!showPassword && (
          <img
            src={closeEyeIcon}
            alt="close icon"
            onClick={() => toggleShowPassword()}
          />
        )}
        {showPassword && (
          <img
            src={openEyeIcon}
            alt="open icon"
            onClick={() => toggleShowPassword()}
          />
        )}
      </>
    )
  };
  
  export default PasswordInput;