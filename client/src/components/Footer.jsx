import React from 'react'
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <>
      <footer className="mx-auto mt-32 w-full max-w-container px-4 sm:px-6 lg:px-8 relative">
        <div className="border-t border-slate-900/5 py-10">
          <div className="flex justify-center items-center">
            <img src={logo} alt="logo_here" className="w-[30vh]" />
          </div>
          <p className="mt-5 text-center text-sm leading-6 text-slate-500">© 2023 GraphPathGuru. All rights reserved.</p>
        </div>
      </footer>

    </>
  );
};

export default Footer;
