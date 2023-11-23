import React, { useContext, useEffect } from 'react'
import Navbar from './Navbar'
import userContext from "../context/User/userContext";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Footer from './Footer';

const UserProfile = () => {
    const context = useContext(userContext);
    const { userData, getuserinfo } = context;
   
    let navigate = useNavigate();

    useEffect(() => {
      getuserinfo();
    }, []);

    const calculateTimeAgo = (dateString) => {
        const showUserDate = new Date(dateString);
        const currentDate = new Date();
    
        const timeDifference = currentDate - showUserDate;
    
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
    
        if (years > 0) {
          return `${years} ${years === 1 ? "year" : "years"}`;
        } else if (months > 0) {
          return `${months} ${months === 1 ? "month" : "months"}`;
        } else if (days > 0) {
          return `${days} ${days === 1 ? "day" : "days"}`;
        } else if (hours > 0) {
          return `${hours} ${hours === 1 ? "hour" : "hours"}`;
        } else if (minutes > 0) {
          return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
        } else {
          return `just now`;
        }
      }
      const looker = () => {
        if(localStorage.getItem('token')){
          navigate('/');
        }else{
          navigate('/login');
        }
      }

  return (
    <>
    <Navbar/>
    <div className="relative max-w-md mx-auto md:max-w-2xl min-w-0 break-words bg-white w-full mb-6 shadow-2xl shadow-sky-700/40 rounded-xl mt-[10vh] ring-1 ring-sky-600/50 ">
    <div className="px-6">
        <div className="flex flex-wrap justify-center">
            <div className="w-full flex justify-center">
                <div className="relative">
                  {userData?.image ?
                    <img src={userData?.image} className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px] bg-white" alt='pfp'/>
                    :
                    <UserCircleIcon className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px] bg-white"/>}
                </div>
            </div>
            <div className="w-full text-center mt-20">
                <div className="flex justify-center lg:pt-4 pt-8 pb-0 gap-2">
                    <div className="p-3 text-center">
                    <span className="text-2xl font-bold block uppercase tracking-wide text-slate-700">{calculateTimeAgo(userData.date)}</span>
                        <span className="text-md text-slate-400">Joined</span>
                    </div>
                    <div className="p-3 text-center">
                        <span className="text-2xl font-bold block uppercase tracking-wide text-slate-700">{userData.graphs}</span>
                        <span className="text-md text-slate-400">Total Graphs</span>
                    </div>

                    {/* <div className="p-3 text-center">
                    <span className="text-2xl font-bold block uppercase tracking-wide text-slate-700">{userData.graphs}</span>
                        <span className="text-md text-slate-400">Total Graphs</span>
                    </div> */}
                </div>
            </div>
        </div>
        <div className="text-center mt-2">
            <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1">{userData.name}</h3>
            <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
                <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i>{userData.email}
            </div>
        </div>
        <div className="mt-6 py-6 border-t border-slate-200  text-center ">
            <div className="flex flex-wrap justify-center">
                <div className="w-full px-4">
                <button className="underline text-sky-700 hover:text-black transition duration-150 ease-in-out" onClick={() => navigate(`/settings`)}>
                Settings
                <span aria-hidden="true" >
                →
                </span>
                </button>
                <button className="underline text-sky-700 hover:text-black transition duration-150 ease-in-out ml-5" onClick={looker}>
                Home
                <span aria-hidden="true" >
                →
                </span>
                </button>
                <button className="underline text-sky-700 hover:text-black transition duration-150 ease-in-out ml-5" onClick={() => navigate(`/docs`)}>
                Documentation
                <span aria-hidden="true" >
                →
                </span>
                </button>
                </div>
            </div>
        </div>
    </div>
</div>


<Footer/>
</>
  )
}

export default UserProfile
