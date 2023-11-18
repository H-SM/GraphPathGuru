import React, { useContext, useEffect } from "react";
import userContext from "../context/User/userContext";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const UserSection = () => {
  const context = useContext(userContext);
  const { userData, getuserinfo } = context;
  let navigate = useNavigate();
  return (
    <>
      {userData && (
        <div className="bottom-5 right-7 fixed hover:cursor-pointer" onClick={() => navigate("/settings")}>
          <div className="bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-white w-[30vh] h-[6vh] sticky rounded-full ring-1 ring-sky-700/50 flex flex-row justify-center items-center gap-x-2">
            <div className="w-[24vh] h-[5vh] justify-end items-center">
              <div className="flex flex-col h-[5vh] justify-center items-end">
                <p className="text-sky-700 font-bold font-sans lg:text-[16px] 2xl:text-[19px] text-[15px] cursor-default">
                  {userData.name}
                </p>
                <p className="text-sky-700/80 mt-[-0.375rem] cursor-default text-[11px] 2xl:text-[15px] ">
                  {userData.email}
                </p>
              </div>
            </div>
            <div className="w-[6vh] h-full rounded-full flex items-center justify-end">
              {userData?.image ? (
                <img
                  src={userData?.image}
                  alt="pfp"
                  className="w-[6vh] h-[6vh] object-contain"
                />
              ) : (
                <UserCircleIcon
                  className="w-[6vh] h-[6vh] text-cyan-600"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        </div>
      )}
      <div className="bottom-5 left-7 fixed">
        <div className="bg-white-700 w-[20vh] h-[15vh] sticky">
          <p className="text-transparent font-bold">Sid is NOOB</p>
        </div>
      </div>
    </>
  );
};

export default UserSection;
