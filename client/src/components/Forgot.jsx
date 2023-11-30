import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import userContext from "../context/User/userContext";
import { useNavigate } from "react-router-dom";
import NavbarOut from "./NavbarOut";

const Forgot = (props) => {
  const [email, setEmail] = useState("");
  const { showAlert } = props;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userId = urlParams.get("userId");
  let navigate = useNavigate();

  const context = useContext(userContext);
  const { forgotPassword } = context;

  const [showpassword, setShowpassword] = useState(false);

  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");

  let json;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password != cpassword) {
      showAlert("Recheck your new password!", "warning");
      return;
    }

    if (userId) {
      const sendMail = false;
      const data = { userId, password, sendMail };
      json = await forgotPassword(data);

      if (json.success) {
        navigate("/");
        showAlert("Password changed Successfully!", "success");
      } else {
        showAlert("Wrong user ID, Try Again!", "danger");
      }
    } else {
      const sendMail = true;
      const data = { sendMail, email };
      json = await forgotPassword(data);

      if (json.success) {
        showAlert("Email Sent Successfully!", "success");
      } else {
        showAlert(json.error, "danger");
      }
    }
  };

  const onChange = (e) => {
    if (e.target.name == "email") {
      setEmail(e.target.value);
    } else if (e.target.name == "password") {
      setpassword(e.target.value);
    } else if (e.target.name == "cpassword") {
      setcpassword(e.target.value);
    }
  };

  return (
    <>
    <NavbarOut/>
      <div>
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>

        <section>
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="flex items-center mb-6">
              <img className="w-[25vh]" src={logo} alt="logo" />
            </div>
            <div className="w-full bg-transparent rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                  {"Forgot Password"}
                </h1>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 md:space-y-6"
                  action="#"
                >
                  {userId ? (
                    <div>
                      <div className="relative">
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          New Password
                        </label>
                        <input
                          type={showpassword ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder={showpassword ? "password" : "••••••••"}
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                          onChange={onChange}
                          minLength={3}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-[55%] text-[#fff] focus:outline-none"
                          onClick={() => setShowpassword(!showpassword)}
                        >
                          {showpassword ? (
                            <svg
                              className="w-6 h-6 text-gray-800"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 18"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1.933 10.909A4.357 4.357 0 0 1 1 9c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 19 9c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M2 17 18 1m-5 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6 text-gray-800"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 14"
                            >
                              <g
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              >
                                <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z" />
                              </g>
                            </svg>
                          )}
                        </button>
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block mb-2 mt-4 text-sm font-medium text-gray-900"
                        >
                          Refill password
                        </label>
                        <input
                          type="password"
                          name="cpassword"
                          id="cpassword"
                          placeholder="••••••••"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                          onChange={onChange}
                          minLength={3}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Your email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                        placeholder="email@gmail.com"
                        onChange={onChange}
                        minLength={3}
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full text-white bg-cyan-600 hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 text-center"
                  >
                    Continue
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Forgot;
