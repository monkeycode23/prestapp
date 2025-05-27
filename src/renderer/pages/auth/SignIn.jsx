import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Logo from "../../images/logo/logo.svg";
import LogoDark from "../../images/logo/logo-dark.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useValidate from "../../hooks/useValidate";
import Person from "./ImagSvg";
import { Eye, EyeOff } from "../../components/Icons";
import {
  validateRules,
  validateUserName,
  validateUserEmail,
  initFields,
  comparePassword,
  generateToken,
} from "./funcs";
import { GoogleIcon } from "../../components/Icons";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { validate, fields, setField, errors } = useValidate(initFields);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submit = async (e, formData) => {
    e.preventDefault();

    const isValidated = validate(validateRules);

    if (!isValidated) {
      return;
    }

    function togglErr(err) {
      if (err) {
        setField({
          type: "error",
          field: "username",
          error: "Informacion de usuario incorrecta",
        });
        setField({
          type: "error",
          field: "password",
          error: "Informacion de usuario incorrecta",
        });
      } else {
        setField({ type: "validate", field: "username" });
        setField({ type: "validate", field: "password" });
      }
    }

    let user;
    if (fields.username.value.includes("@")) {
      user = await validateUserEmail(fields.username.value);
    } else {
      user = await validateUserName(fields.username.value);
    }

    if (!user) {
      togglErr(true);
      return;
    }

    const compare = await comparePassword(fields.password.value, user.password);

    if (!compare) {
      togglErr(true);
      return;
    }

    setField({ type: "validate", field: "username" });
    setField({ type: "validate", field: "password" });

    
    try {
      const mongo_user =await window.mongo.findOne("User", { sqlite_id: user.id });
      
      console.log(mongo_user)
      
      console.log(window.database.models.Users)
      
      await window.database.models.Users.updateUser({
        id: user.id,
        mongo_id: mongo_user._id,
      });

      const token = await generateToken(
        user,
        rememberMe
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 30 dias
          : new Date(Date.now() + 2 * 60 * 60 * 1000)
      );
  
      //console.log(token);
      dispatch(login({ user: user, token: token }));
  
    } catch (error) {
      console.log(error);
    }

    navigate("/dashboard");
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img className="hidden dark:block" src={Logo} alt="Logo" />
                <img className="dark:hidden" src={LogoDark} alt="Logo" />
              </Link>

              <p className="2xl:px-20">
                <Link to="/">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  suspendisse.
                </Link>
              </p>

              <span className="mt-15 inline-block">
                <Person></Person>
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">Start for free</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Inicia sesión en tu cuenta
              </h2>

              <form onSubmit={submit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Usuario
                  </label>
                  <div className="relative">
                    <input
                      name="username"
                      type="text"
                      placeholder="Ingresa tu nombre de usuario"
                      className={`w-full rounded-lg border  ${
                        !fields.username.isValid
                          ? "border-red text-red"
                          : "border-stroke"
                      } focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                      onChange={(e) =>
                        setField({
                          type: "set",
                          field: "username",
                          value: e.target.value,
                        })
                      }
                      defaultValue={fields.username.value}
                      value={fields.username.value}
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                            fill=""
                          />
                          <path
                            d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                  {fields.username.error.length == 0 ? (
                    <></>
                  ) : (
                    <div className="text-center text-red ">
                      {fields.username.error}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) =>
                        setField({
                          type: "set",
                          field: "password",
                          value: e.target.value,
                        })
                      }
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="6+ Characters, 1 Capital letter"
                      defaultValue={fields.password.value}
                      value={fields.password.value}
                      className={`w-full rounded-lg border  ${
                        fields.password.error
                          ? "border-red text-red"
                          : "border-stroke"
                      } focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    />

                    <span className="flex gap-1 absolute right-4 top-4">
                      <span onClick={togglePasswordVisibility}>
                        {showPassword ? (
                          <Eye opacity="0.5" width={22} height={22}></Eye>
                        ) : (
                          <EyeOff opacity="0.5" width={22} height={22}></EyeOff>
                        )}
                      </span>

                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>

                  {fields.password.error.length == 0 ? (
                    <></>
                  ) : (
                    <div className="text-center text-red ">
                      {fields.password.error}
                    </div>
                  )}
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
              </form>

              <div className="mb-5 flex items-center">
                <input
                  className="mr-2 p-2 accent-primary"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="font-medium text-black dark:text-white">
                  Recordar mi session
                </label>
              </div>

              <button className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                <span>
                  <GoogleIcon></GoogleIcon>
                </span>
                Registrate con tu cuenta de Google
              </button>

              <div className="mt-6 text-center">
                <p>
                  No tienes una cuenta?{" "}
                  <Link to="/auth/signup" className="text-primary">
                    Registrate
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
