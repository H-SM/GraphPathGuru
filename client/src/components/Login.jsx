import React, { useContext, useState } from 'react';
import logo from '../assets/logo.png';
import userContext from "../context/User/userContext";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [ credentails , setCredentails ] =useState({email: "", password: "", name : "", cpassword: ""});
  
  const [signup,setSignup] = useState(false);
  const [showpassword, setShowpassword]= useState(false);
  let navigate = useNavigate();

  const context = useContext(userContext);
  const { login, signin } = context;

  const handleSubmit =async (e) => {
    e.preventDefault();

  let json;

  if (signup) {
    // If signup is true, call the signin context
    if(credentails.password !== credentails.cpassword){
      alert("Recheck your new password!");
      return ;
    }
    json = await signin({name : credentails.name, email: credentails.email , password : credentails.password });
    if(json.success){
      //save the auth_token and redirect
      localStorage.removeItem('token');
      localStorage.setItem('token', json.jwt_token);
      navigate("/");
      alert("Account created successfully!", "success");
  }else{
      alert("Invalid Credentials! Please check again...");
  }
  } else {
    // If signup is false, call the login context
    json = await login({email: credentails.email , password : credentails.password});
    if(json.success){
      localStorage.setItem('token', json.auth_token);
      alert("Logged in successfully!", "success");
      navigate("/");
  }else{
      alert("Invalid credentails! Please check again...")
  }
  }
  }
  const onChange = (e) =>{
    setCredentails({...credentails,[e.target.name] : e.target.value});
  }

  return (
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
  {/* <div className="relative z-20 mx-auto max-w-container px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8">
    <div className="mx-auto max-w-[45rem] text-center">
      <h1 className="text-base font-semibold leading-7 text-sky-500">Graphs anywhere, anytime.</h1>
      <div className='flex justify-center items-center'>
    <img src={logo} alt="logo_here" className='w-[50vh]'/>
    </div> */}
    {/* <p className="mt-4 text-md text-slate-700"> Shortest path algorithms can be difficult to understand due to their complexity. We aim to simplify them through visualization.Educators struggle to teach these complex algorithms effectively. Our project provides an interactive learning tool.</p> */}
    {/* </div>
    </div> */}
    <section >
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="flex items-center mb-6">
          <img className="w-[25vh]" src={logo} alt="logo"/>    
      </div>
      <div className="w-full bg-transparent rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                  {signup ? "Create a new account" : "Sign in to your account"}
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                {signup &&
                    <div>
                      <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 ">Your name</label>
                      <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="h-sm" onChange={onChange} minLength={3} required/>
                  </div>
                }
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="email@gmail.com" onChange={onChange} minLength={3} required/>
                  </div>
                  <div >
                    <div className='relative'>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                      <input type=
                      {showpassword ? 'text' : 'password'}
                       name="password" id="password" placeholder={showpassword ? 'password' : "••••••••"} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" onChange={onChange} minLength={3} required/>
            <button
              type="button"
              className="absolute right-3 top-[55%] text-[#fff] focus:outline-none"
              onClick={() => setShowpassword(!showpassword)}
            >
             
              {showpassword ? (
                <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1.933 10.909A4.357 4.357 0 0 1 1 9c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 19 9c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M2 17 18 1m-5 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
              </svg>         
              ) : (
                <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 14">
                <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                  <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z"/>
                </g>
              </svg> 
              )}
            </button>
            </div>
                {!signup ? 
                      <a href="/forgot-password" className="text-sm text-end font-medium text-primary-600 hover:underline">Forgot password?</a> 
                      : 
                      <div>
                      <label htmlFor="password" className="block mb-2 mt-4 text-sm font-medium text-gray-900">Refill password</label>
                      <input type='password'
                       name="cpassword" id="cpassword" placeholder= "••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" onChange={onChange} minLength={3} required/>
            </div>
            }
                  </div>
                  <button type='submit' className="w-full text-white bg-cyan-600 hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 text-center">{signup ? "Sign up" : "Log in"}</button>
                  <div className="text-sm font-light flex flex-row items-center justify-center gap-1">
                      <p>{signup ? "Already have an account? " : "Don't have an account yet? "}</p>
                      <p onClick={() => setSignup(!signup)} className="font-medium text-primary-600 hover:underline hover:cursor-pointer select-none">{ signup ? "Log in":"Sign up"}</p>
                  </div>
              </form>
          </div>
      </div>
  </div>
</section>
    </div>
  )
}

export default Login
