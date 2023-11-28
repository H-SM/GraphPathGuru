import React, { useEffect } from "react";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import NavbarOut from "./NavbarOut";
import step1 from '../assets/steps_1.png';
import step2 from '../assets/steps_2.png';
import step3 from '../assets/steps_3.png';
import step4 from '../assets/steps_4.png';

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
            Know our project further with the diverse documentation over various
            aspects
          </p>
        </div>

        <div className="flex justify-center items-center mt-9">
          <section className="grid grid-cols-1 gap-x-8 gap-y-6 pb-20 xl:grid-cols-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Start Looking into it!
            </h2>
            <div className="col-span-3">
              <div className="max-w-[54rem] text-lg leading-8 text-slate-600">
                <p>
                  Graphpathguru is a user-friendly application meticulously
                  crafted to offer individuals an accessible platform for
                  in-depth exploration and understanding of algorithmic
                  operations, all presented in a visually intuitive manner. The
                  platform boasts a diverse array of algorithms, providing users
                  with the flexibility to choose and engage with various
                  computational processes.
                </p>
                <p className="mt-6">
                  Additionally, Graphpathguru includes a host of convenient
                  features, including the ability to save generated graphs for
                  future reference and a streamlined sharing function for
                  uniform graph distribution. This comprehensive tool aims to
                  empower users with a seamless and enriching experience in
                  algorithmic analysis, combining ease of use with robust
                  functionality.
                </p>
              </div>
            </div>
          </section>
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
          <section
            id="start"
            className="grid grid-cols-1 gap-x-8 gap-y-6 pb-20 pt-10 xl:grid-cols-4 max-w-[80%] justify-center  "
          >
            <h3 className="text-2xl font-semibold leading-9 tracking-tight text-slate-900">
              How to Start?
            </h3>
            <div className="col-span-3">
              <p className="max-w-3xl text-base leading-8 text-slate-700">
                Graphpathguru is a application focused on making graph
                algorithms more accessible and understandable for users. By
                providing a visually intuitive platform, users can explore and
                comprehend the operations of various algorithms.
              </p>
              <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 text-sm leading-6 sm:grid-cols-2 lg:grid-cols-2">
                <div>
                <div className="relative aspect-[3/2] object-contain overflow-hidden rounded-xl bg-slate-200 shadow-lg shadow-cyan-700/30">
                  <img className="w-full h-full object-cover" src={step1} alt=""/>
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5"></div>
                  </div>
                  <p className="mt-6 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                      Step 1
                    </strong>{" "}
                    – Launch the application in the "Playground" state to start
                    exploring. This will serve as the starting point for your
                    interactive experience.
                  </p>
                </div>
                <div>
                <div className="relative aspect-[3/2] object-contain overflow-hidden rounded-xl bg-slate-200 shadow-lg shadow-cyan-700/30">
                  <img className="w-full h-full object-cover" src={step2} alt=""/>
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5"></div>
                  </div>
                  <p className="mt-6 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                      Step 2
                    </strong>{" "}
                    – Carefully choose the nodes and the particular application
                    you want to work with from the application's dropdown menu.
                    Create edges between these nodes to establish meaningful
                    connections and illustrate the complex interactions in the
                    system of your choice.
                  </p>
                </div>
                <div>
                <div className="relative aspect-[3/2] object-contain overflow-hidden rounded-xl bg-slate-200 shadow-lg shadow-cyan-700/30">
                  <img className="w-full h-full object-cover" src={step3} alt=""/>
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5"></div>
                  </div>
                  <p className="mt-6 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                      Step 3
                    </strong>{" "}
                    – By adding weights to the edges, you can capture the subtle
                    relevance of each relationship and increase the depth of
                    your study. Once these weightings are set, start the
                    visualization process so that the program can show you how
                    your selected algorithm flows and affects the associated
                    nodes in real time.
                  </p>
                </div>
                <div>
                <div className="relative aspect-[3/2] object-contain overflow-hidden rounded-xl bg-slate-200 shadow-lg shadow-cyan-700/30">
                  <img className="w-full h-full object-cover" src={step4} alt=""/>
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5"></div>
                  </div>
                  <p className="mt-6 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                      Step 4
                    </strong>{" "}
                    – After the visualization process is finished, the program
                    will provide detailed findings according to
                    the used algorithm.
                  </p>
                </div>
              </div>
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-y-10">
                <div>
                  <p className="text-base leading-7 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                      Universal Sharing
                    </strong>{" "}
                    —{" "}
                    <span>
                      Every graph created comes with a shareable link, enabling
                      users to effortlessly share their work universally with
                      others.
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-base leading-7 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                      Lively Graph Visualization
                    </strong>{" "}
                    —{" "}
                    <span>
                      Graphs come to life with vibrant visualizations, enhancing
                      the overall user experience by making the application not
                      just functional but also enjoyable and dynamic.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="divide-y divide-slate-700/10 border-t border-slate-700/10 flex justify-center items-start mt-9">
          <section
            id="start"
            className="grid grid-cols-1 gap-x-8 gap-y-6 pb-20 pt-10 xl:grid-cols-4 max-w-[80%] justify-start  "
          >
            <h3 className="text-2xl font-semibold leading-9 tracking-tight text-slate-900">
              Overview
            </h3>
            <div className="col-span-3">
              <div className="text-slate-600 max-w-3xl text-base leading-8">
                <p className="">
                  Graphpathguru stands as a meticulously crafted, user-friendly
                  application designed to provide an accessible platform for
                  in-depth exploration and comprehension of algorithmic
                  operations. Offering a visually intuitive interface, the
                  platform encompasses a diverse array of algorithms, granting
                  users the flexibility to engage with various computational
                  processes.
                </p>
                <p className="mt-6">
                  Elevate your exploration experience by launching the
                  application in the dynamic "Playground" state, setting the
                  stage for an engaging interactive journey.
                </p>
                <p className="mt-6">
                  Thoughtfully select nodes and your preferred application from
                  the dropdown menu, establishing connections through edges.
                  This visual representation brings to life intricate
                  relationships within your chosen system.
                </p>
                <p className="mt-6">
                  Deepen your analysis by assigning weights to edges, capturing
                  nuanced connections. Initiate the visualization process to
                  witness the real-time flow and impact of the selected
                  algorithm on associated nodes.
                </p>
                <p className="mt-6">
                  Upon completion, the application provides detailed findings
                  based on the utilized algorithm, enriching your understanding
                  of complex systems.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="divide-y divide-slate-700/10 border-t border-slate-700/10 flex justify-center items-center mt-9">
          <section
            id="start"
            className="grid grid-cols-1 gap-x-8 gap-y-6 pb-20 pt-10 xl:grid-cols-4 max-w-[80%] justify-center  "
          >
            <h3 className="text-2xl font-semibold leading-9 tracking-tight text-slate-900">
              Features
            </h3>
            <div className="col-span-3">
              
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-y-10">
                <div>
                  <p className="text-base leading-7 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                    User-Friendly Interface
                    </strong>{" "}
                    —{" "}
                    <span>
                    The application likely has a user-friendly interface that makes it easy for users, even those without a deep understanding of graph algorithms, to navigate and interact with the tool.
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-base leading-7 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                    Algorithm Variety
                    </strong>{" "}
                    —{" "}
                    <span>
                    Graphpathguru offers a range of graph algorithms for users to choose from. This could include well-known algorithms like Dijkstra's algorithm, breadth-first search, depth-first search, and more.
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-base leading-7 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                    Visualization
                    </strong>{" "}
                    —{" "}
                    <span>
                    The tool likely provides graphical representations of graphs and the outcomes of algorithms. Visualizations can help users better understand how algorithms traverse and manipulate graph structures.
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-base leading-7 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                    Options for Saving Graphs
                    </strong>{" "}
                    —{" "}
                    <span>
                    Users may have the ability to save the graphs they create or the results of algorithm executions. This feature is valuable for future reference or for sharing with others.
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-base leading-7 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                    Sharing Functionality
                    </strong>{" "}
                    —{" "}
                    <span>
                    Graphpathguru might have options for users to easily share their graphs or algorithm results with others. This could involve generating shareable links or exporting files in common formats.
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-base leading-7 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                    Educational Purpose
                    </strong>{" "}
                    —{" "}
                    <span>
                    The tool could be designed with an educational focus, helping users learn about graph algorithms through hands-on exploration rather than relying solely on theoretical explanations.
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-base leading-7 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                    Algorithm Parameters
                    </strong>{" "}
                    —{" "}
                    <span>
                    Users may have the ability to adjust parameters for each algorithm, allowing them to see how changes impact the algorithm's behavior and results.
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-base leading-7 text-slate-700">
                    <strong className="font-semibold text-slate-900">
                    Real-Time Updates
                    </strong>{" "}
                    —{" "}
                    <span>
                    As users interact with the application, they may see real-time updates to the graph and algorithm outcomes, providing instant feedback.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Docpage;
