import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavbarOut = () => {
  let navigate = useNavigate();
  const location = useLocation();
  //TODO: look over this interlinking
  const [currentPage, setCurrentPage] = useState('');

  const looker = () => {
    if (localStorage.getItem('token')) {
      navigate('/?section=graph');
    } else {
      navigate('/login');
    }
  }

  const docslooker = () => {
    if (currentPage !== 'docs') {
      navigate('/docs');
    }
    else if (localStorage.getItem('token')) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }

  useEffect(() => {
    if (location.pathname === '/docs') {
      setCurrentPage('docs');
    } else if (location.pathname.includes('/graph/')) {
      setCurrentPage('graph');
    } else {
      setCurrentPage('');
    }
  }, [location.pathname]);

  return (
    <>
      <header className="relative z-40 w-full flex-none text-sm font-semibold leading-6 text-slate-900">
        <nav aria-label="Global" className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center py-[2.125rem]">
            <Link className="flex-none text-slate-900" to="/"><span className="sr-only">Graph Path Guru</span>
              <img src={logo} alt="logo_here" className='w-[30vh]' />
            </Link>
            <div className="ml-auto hidden lg:flex lg:items-center hover:cursor-pointer">
              <p className="ml-8" onClick={docslooker}>
                {currentPage === 'docs' ? "Home" : "Docs"}
              </p>
            </div>
            <button type="button" className="-my-1 ml-auto flex h-8 w-8 items-center justify-center rounded-lg lg:ml-8"><span className="sr-only">Search components</span><svg fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-gray-900 hover:fill-gray-900"><path d="M20.47 21.53a.75.75 0 1 0 1.06-1.06l-1.06 1.06Zm-9.97-4.28a6.75 6.75 0 0 1-6.75-6.75h-1.5a8.25 8.25 0 0 0 8.25 8.25v-1.5ZM3.75 10.5a6.75 6.75 0 0 1 6.75-6.75v-1.5a8.25 8.25 0 0 0-8.25 8.25h1.5Zm6.75-6.75a6.75 6.75 0 0 1 6.75 6.75h1.5a8.25 8.25 0 0 0-8.25-8.25v1.5Zm11.03 16.72-5.196-5.197-1.061 1.06 5.197 5.197 1.06-1.06Zm-4.28-9.97c0 1.864-.755 3.55-1.977 4.773l1.06 1.06A8.226 8.226 0 0 0 18.75 10.5h-1.5Zm-1.977 4.773A6.727 6.727 0 0 1 10.5 17.25v1.5a8.226 8.226 0 0 0 5.834-2.416l-1.061-1.061Z"></path></svg></button>
            <button type="button" className="-my-1 -mr-1 ml-6 flex h-8 w-8 items-center justify-center lg:hidden">
              <span className="sr-only">Open navigation</span><svg viewBox="0 0 24 24" className="h-6 w-6 stroke-slate-900"><path d="M3.75 12h16.5M3.75 6.75h16.5M3.75 17.25h16.5" fill="none" strokeWidth="1.5" strokeLinecap="round"></path></svg></button>
            <div className="hidden lg:ml-8 lg:flex lg:items-center lg:border-l lg:border-slate-900/15 lg:pl-8">
              <Link className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700 -my-2.5" to="/docs?section=start"><span>How to start <span aria-hidden="true">→</span></span></Link></div></div></nav></header>


      <section className="relative h-[17vh] z-40">
        <div className="absolute left-1/2 top-[5%] mx-auto flex w-[90%] max-w-[960px] flex-col items-center rounded-xl -translate-x-1/2 bg-gradient-to-t from-white to-sky-400 p-4 sm:justify-between sm:px-8 md:flex-row md:py-6 lg:w-full">
          <div className="flex flex-row items-center">
            <img src={logo} alt="" className="inline-block item-center w-[25vh] rounded-full object-cover" />
            <button
              className="group -my-2 hidden items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs text-slate-900 ring-1 ring-inset ring-black/[0.08] hover:bg-white/80 hover:ring-black/[0.13] ml-2 sm:flex md:hidden lg:flex xl:flex" onClick={looker}><svg className="h-4 w-4 fill-sky-500" viewBox="0 0 24 24"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd"></path></svg>
              <span className="font-semibold">Make Your Graphs</span>
              <svg width="2" height="2" aria-hidden="true" className="fill-slate-900"><circle cx="1" cy="1" r="1"></circle></svg>
              <span className="font-medium"><span className="md:hidden">New Graphs</span><span className="hidden md:inline">Learn by visualizing your graphs</span></span>
              <svg viewBox="0 0 5 8" className="h-2 w-[5px] fill-black/30 group-hover:fill-black/60" fillRule="evenodd" clipRule="evenodd" aria-hidden="true"><path d="M.2.24A.75.75 0 0 1 1.26.2l3.5 3.25a.75.75 0 0 1 0 1.1L1.26 7.8A.75.75 0 0 1 .24 6.7L3.148 4 .24 1.3A.75.75 0 0 1 .2.24Z"></path>
              </svg>
            </button>
          </div>
          <div className="mt-4 flex flex-row items-center justify-center gap-4 md:mt-0">
            <Link href="#" className="inline-block rounded-xl border border-black bg-white px-10 py-3 font-semibold text-sky-700 [box-shadow:rgb(3,_105,_161)_6px_6px] transition ease-in-out duration-200 delay-75 hover:[box-shadow:rgb(3,_105,_161)_0px_0px] hover:bg-white/80 hover:text-black" to="/login">Get Started</Link>

          </div>
        </div>
      </section>

    </>

  )
}

export default NavbarOut