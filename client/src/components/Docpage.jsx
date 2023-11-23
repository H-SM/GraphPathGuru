import React, { useEffect } from 'react'
import Footer from './Footer'
import { useLocation } from 'react-router-dom';
import NavbarOut from './NavbarOut';

const Docpage = () => {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sectionToScroll = queryParams.get("section");
    console.log(sectionToScroll);

    if (sectionToScroll) {
      const targetSection = document.getElementById(sectionToScroll);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.search]);


  return (
    <div>
      <NavbarOut />

      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Documentation
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Know our project further with the diverse documentation over various aspects
          </p>
        </div>

        <div className='flex justify-center items-center mt-9'>
          <section className="grid grid-cols-1 gap-x-8 gap-y-6 pb-20 xl:grid-cols-4"><h2 className="text-3xl font-bold tracking-tight text-slate-900">Start Looking into it!</h2><div className="col-span-3"><div className="max-w-[54rem] text-lg leading-8 text-slate-600"><p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p><p className="mt-6">Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p></div></div></section>
        </div>

        <div
          className="absolute inset-x-0 top-[10vh] -z-10 transform-gpu overflow-hidden blur-3xl "
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
        <div className="divide-y divide-slate-700/10 border-t border-slate-700/10 flex justify-center items-center mt-9">
          <section id="start" className="grid grid-cols-1 gap-x-8 gap-y-6 pb-20 pt-10 xl:grid-cols-4 max-w-[80%] justify-center  ">
            <h3 className="text-2xl font-semibold leading-9 tracking-tight text-slate-900">How to Start?</h3>
            <div className="col-span-3">
              <p className="max-w-3xl text-base leading-8 text-slate-700">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.</p>
              <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 text-sm leading-6 sm:grid-cols-2 lg:grid-cols-3">
                <div><div className="relative aspect-[280/190] overflow-hidden rounded-xl bg-slate-200"><img src="" alt="" />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5"></div>
                </div>
                  <p className="mt-6 text-slate-700"><strong className="font-semibold text-slate-900">Step 1</strong> – There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</p>
                </div>
                <div>
                  <div className="relative aspect-[280/190] overflow-hidden rounded-xl bg-slate-200"><img src="" alt="" /><div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5"></div></div><p className="mt-6 text-slate-700"><strong className="font-semibold text-slate-900">Step 2</strong> – All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
                </div>
                <div><div className="relative aspect-[280/190] overflow-hidden rounded-xl bg-slate-200"><img src="" alt="" /><div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5"></div></div><p className="mt-6 text-slate-700"><strong className="font-semibold text-slate-900">Step 3</strong> – randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p></div>
              </div>
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-y-10"><div>
                <p className="text-base leading-7 text-slate-700"><strong className="font-semibold text-slate-900">More on it</strong> — <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</span>
                </p>
              </div>
                <div><p className="text-base leading-7 text-slate-700"><strong className="font-semibold text-slate-900">Hundreds of ideas</strong> — <span>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.</span></p></div></div></div>
          </section>

        </div>

      </div>
      <Footer />
    </div>
  )
}

export default Docpage