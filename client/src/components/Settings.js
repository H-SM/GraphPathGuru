import React, { useContext, useEffect } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Navbar from "./Navbar";
import Footer from "./Footer";
import contextValue from "../context/User/userContext.js";
import { useNavigate } from "react-router-dom";
import CloudinaryUploadWidget from "./cloudinaryUpload.js";

const Settings = () => {
  let navigate = useNavigate();
  useEffect(()=>{
      if(localStorage.getItem('token')){
        
      }else{
        navigate('/login');
      }
      // eslint-disable-next-line
    },[]);
    const context = useContext(contextValue);
    const { userData, setUserData, getuserinfo } = context;
    useEffect(() => {
      getuserinfo();
    },[]);
  return (
    <>
      <Navbar />

      <div class="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
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

        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Settings
          </h2>
          <p class="mt-2 text-lg leading-8 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>
        </div>

        <div className="flex justify-center items-center mt-8">
          <form>
            <div className="space-y-12 ">
              <div className="border-b w-[100vh] border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Profile
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600"></p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                    <label
                      htmlFor="photo"
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
                          name="username"
                          id="username"
                          autoComplete="username"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder={userData.name}
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
                      {userData.image ? 
                      <img src={userData.image} className="h-[15vh] w-[15vh]" alt="pfp"/>
                      :
                      <UserCircleIcon
                        className="h-[15vh] w-[15vh] text-cyan-600"
                        aria-hidden="true"
                      />
                      }
                      <CloudinaryUploadWidget/>
                    </div>
                  </div>
                </div>
                <div className="col-span-full mt-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2 flex flex-col items-center justify-center gap-y-2">
                      <div className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="password"
                          name="oldpassword"
                          id="oldpassword"
                          autoComplete="oldpassword"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 mx-2"
                          placeholder="••••••••"
                        />
                      </div>
                      <a href="#" class="text-sm text-end font-medium text-primary-600 hover:underline">Forgot password?</a> 
                    </div>
                  </div>
                  <div className="col-span-full mt-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      New Password
                    </label>
                    <div className="mt-2 flex justify-center">
                      <div className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="password"
                          name="newpassword"
                          id="newpassword"
                          autoComplete="newpassword"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 mx-2"
                          placeholder="••••••••"
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
