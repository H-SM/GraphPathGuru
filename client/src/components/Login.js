import React from 'react'
import Navbar from './Navbar';
import logo from '../assets/logo.png';



const Login = () => {
  return (
    <div>
      <Navbar/>
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
  <div class="relative z-20 mx-auto max-w-container px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8">
    <div class="mx-auto max-w-[45rem] text-center">
      <h1 class="text-base font-semibold leading-7 text-sky-500">Graphs anywhere, anytime.</h1>
      <div className='flex justify-center items-center'>
    <img src={logo} alt="logo_here" className='w-[50vh]'/>
    </div>
    {/* <p class="mt-4 text-md text-slate-700"> Shortest path algorithms can be difficult to understand due to their complexity. We aim to simplify them through visualization.Educators struggle to teach these complex algorithms effectively. Our project provides an interactive learning tool.</p> */}
    </div></div>
    </div>
  )
}

export default Login
