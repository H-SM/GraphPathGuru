import React, { useContext, useEffect, useState } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Navbar from "./Navbar";
import Footer from "./Footer";
import contextValue from "../context/User/userContext.js";
import { useNavigate } from "react-router-dom";
import CloudinaryUploadWidget from "./cloudinaryUpload";

const Settings = () => {
  const [details, setDetails] = useState({
    oldpassword: "",
    newpassword: "",
    checkpassword: "",
    name: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  let navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  const context = useContext(contextValue);
  const { userData, setUserData, getuserinfo, changename, changepassword } =
    context;
  useEffect(() => {
    getuserinfo();
  }, []);
  //looks over the changes in the info
  const handleSubmit = async (e) => {
    e.preventDefault();
    let flag = false;
    if (details.name.trim() !== "" || details.name.trim() !== userData.name) {
      try {
        const updatedUser = await changename({ name: details.name });
        if (!updatedUser.success) {
          alert(updatedUser.error);
        } else {
          setUserData((prevUserData) => ({
            ...prevUserData,
            name: details.name,
          }));
          flag = true;
        }
      } catch (error) {
        console.error("Error updating name:", error);
      }
    }
    if (
      details.oldpassword.trim() !== "" ||
      details.newpassword.trim() !== "" ||
      details.checkpassword.trim() !== ""
    ) {
      if (details.newpassword !== details.checkpassword) {
        alert("Recheck your new password!");
        return;
      } else {
        try {
          const updatedUser = await changepassword({
            oldpassword: details.oldpassword,
            newpassword: details.newpassword,
          });

          if (!updatedUser.success) {
            alert(updatedUser.error);
          } else {
            flag = true;
          }
        } catch (error) {
          console.error("Error updating password:", error);
        }
      }
    }
    if (flag) {
      alert("details updated");
    } else {
      alert("Recheck your credentails!");
    }
  };
  //looks over closing of the window
  const handleclick = (e) => {
    setUserData({});
    navigate("/");
  };

  const onChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleCancel = (e) => {
    setDetails({
      oldpassword: "",
      newpassword: "",
      checkpassword: "",
      name: "",
    });
    navigate("/");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        navigate("/");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return (
    // right-[3vh] top-[11vh]
    <>
      <Navbar />

      <div className="isolate  px-6 py-24 sm:py-32 lg:px-8">
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

        <div className="mx-auto max-w-2xl text-center">
          <div
            className="absolute 
        right-[17%] top-[25%]
my-3 mx-3 z-50"
          >
            <button
              type="button"
              className="text-black/70 hover:scale-125 rounded-full bg-cyan-600/40 transition ease-in-out transition-500 w-8 h-8"
              onClick={handleclick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-8 h-8 p-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Settings
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>
        </div>

        <div className="flex justify-center items-center mt-8">
          <form onSubmit={handleSubmit} action="#">
            <div className="space-y-12 ">
              <div className="border-b w-[100vh] border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Profile
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600"></p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Username
                    </label>
                    <div className="mt-2 flex justify-center">
                      <div className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                          graphpathguru.com/
                        </span>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          autoComplete="name"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder={userData.name}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Photo
                    </label>
                    <div className="mt-2 flex items-center justify-center gap-x-2">
                      {userData.image ? (
                        <img
                          src={userData.image}
                          className="w-[15vh]"
                          alt="pfp"
                        />
                      ) : (
                        <UserCircleIcon
                          className="h-[15vh] w-[15vh] text-cyan-600"
                          aria-hidden="true"
                        />
                      )}
                      <CloudinaryUploadWidget />
                    </div>
                  </div>
                </div>
                <div className="col-span-full mt-2">
                  <label
                    htmlFor="oldpassword"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2 flex flex-col items-center justify-center gap-y-2">
                    <div className="relative flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        name="oldpassword"
                        id="oldpassword"
                        autoComplete="oldpassword"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 mx-2"
                        placeholder={showOldPassword ? "password" : "••••••••"}
                        onChange={onChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-[20%] text-[#fff] focus:outline-none"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
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
                    <a
                      href="#"
                      className="text-sm text-end font-medium text-primary-600 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="col-span-full mt-4">
                  <label
                    htmlFor="newpassword"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    New Password
                  </label>
                  <div className="mt-2 flex justify-center">
                    <div className="relative flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newpassword"
                        id="newpassword"
                        autoComplete="newpassword"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 mx-2"
                        placeholder={showNewPassword ? "password" : "••••••••"}
                        onChange={onChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-[20%] text-[#fff] focus:outline-none"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
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
                  </div>
                </div>
                <div className="col-span-full mt-4">
                  <label
                    htmlFor="checkpassword"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Refill new Password
                  </label>
                  <div className="mt-2 flex justify-center">
                    <div className="relative flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="password"
                        name="checkpassword"
                        id="checkpassword"
                        autoComplete="checkpassword"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 mx-2"
                        placeholder="••••••••"
                        onChange={onChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6 w-full">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
