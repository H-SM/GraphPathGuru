import React from 'react'
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    let navigate = useNavigate();
    const looker = () => {
        if(localStorage.getItem('token')){
          navigate('/');
        }else{
          navigate('/login');
        }
      }
  return (
<div class="grid h-screen px-4 bg-white place-content-center">
  <div class="text-center">
    <h1 class="font-black text-gray-200 text-9xl">404</h1>

    <p class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
      Uh-oh!
    </p>

    <p class="mt-4 text-gray-500">We can't find that page.</p>

    <button
      onClick={looker}
      class="inline-block px-5 py-3 mt-6 text-sm font-medium text-white hover:text-sky-900 bg-sky-700 rounded hover:bg-transparent focus:outline-none focus:ring hover:ring-1 hover:ring-sky-700 transition ease-in-out duration-300"
    >
      Go Back Home
    </button>
  </div>
</div>

  )
}

export default NotFound
