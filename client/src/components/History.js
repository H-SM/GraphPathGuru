import React, { useContext, useEffect } from "react";
import graphContext from "../context/Graph/graphContext.js";
import { useNavigate } from "react-router-dom";
import { IconButton, Typography } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const History = () => {
  const [active, setActive] = React.useState(1);

  const next = () => {
    if (active === 10) return;

    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;

    setActive(active - 1);
  };
  let context = useContext(graphContext);
  let navigate = useNavigate();

  const { graphs, getallgraph, searchedGraph } = context;
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getallgraph();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  console.log(graphs);

  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleString("en-US", options);
  };
  //get no. of nodes and edges
  const extractEdgesAndNodes = (graphData) => {
    const lines = graphData.split("\n");

    let numEdges = 0;
    let numNodes = 0;

    lines.forEach((line) => {
      const parts = line.split(" ");

      if (parts.length >= 1) {
        numNodes++;

        // TODO: show's wrong answer
        numEdges += parts.length - 1;
      }
    });

    return { numEdges, numNodes };
  };
  return (
    <>
      <div
        id="team"
        class="relative z-20 mx-auto max-w-container px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8"
      >
        <div class="mx-auto max-w-[45rem] text-center">
          <h1 class="text-base font-semibold leading-7 text-sky-500">
            What all you did before?
          </h1>
          <p class="mt-4 text-5xl font-extrabold leading-[3.5rem] tracking-tight text-slate-900">
            Your History.
          </p>
          <p class="mt-4 text-lg text-slate-700">
            {" "}
            Explore your journey through captivating graphs! Your user history
            showcases the beautiful tapestry of charts and insights you've woven
            in our application. Each data point tells a unique story, a
            testament to your exploration and growth.
          </p>
        </div>
      </div>

      {graphs.length === 0 ? (
        <p className="w-full flex justify-center items-center font-bold text-gray-600 text-[15px] mt-[15vh] mb-[15vh]">
          Start your awesome journey by visiting the playground above.
        </p>
      ) : (
        <>
          <div class="flex flex-col mt-8">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8 flex-row justify-center items-center gap-y-3">
              <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div class="mx-[10%] overflow-hidden">
                  <table class="min-w-full text-left text-sm font-light">
                    <thead class="border-b font-medium dark:border-sky-500">
                      <tr>
                        <th
                          scope="col"
                          class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          <p className="hidden">Date</p>
                        </th>
                        <th
                          scope="col"
                          class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          Number of Nodes
                        </th>
                        <th
                          scope="col"
                          class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          Number of Edges
                        </th>
                        <th
                          scope="col"
                          class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          Time Taken
                        </th>
                        <th
                          scope="col"
                          class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          Space Taken
                        </th>
                        <th
                          scope="col"
                          class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          <p className="hidden">favourite</p>
                        </th>
                        <th
                          scope="col"
                          class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-sky-500 px-6"
                        >
                          <p className="hidden">Visit</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchedGraph === "" ? (
                        graphs
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((graph, index) => {
                          const { numNodes, numEdges } = extractEdgesAndNodes(
                            graph.graph
                          );
                          // Extract TC and SC from the result string
                          const resultArray = graph.result
                            .split("\n")
                            .filter((item) => item.trim() !== "");
                          const tc = resultArray[1]?.trim() || "N/A";
                          const sc = resultArray[2]?.trim() || "N/A";

                          return (
                            <tr class="border-b dark:border-sky-200/80">
                              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6">
                                {graph.name}
                              </td>
                              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-light font-mono text-opacity-100 text-gray-400 px-6">
                                {formatTime(graph.date)}
                              </td>
                              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono text-opacity-100 text-gray-700 px-6">
                                {numNodes}
                              </td>
                              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono  text-opacity-100 text-gray-700 px-6">
                                {numEdges}
                              </td>
                              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono  text-opacity-100 text-gray-700 px-6">
                                {tc}
                              </td>
                              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono  text-opacity-100 text-gray-700 px-6">
                                {sc}
                              </td>
                              <td
                                class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono text-opacity-100 text-gray-700 px-6 hover:cursor-pointer"
                                onClick={() => {}}
                              >
                                {graph.favourite ? (
                                  <svg
                                    className="text-[#f3da35]"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    class="bi bi-star-fill"
                                    viewBox="0 0 16 16"
                                  >
                                    {" "}
                                    <path
                                      d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                                      fill="#f3da35"
                                    />{" "}
                                  </svg>
                                ) : (
                                  <svg
                                    className="text-[#f3da35]"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    class="bi bi-star"
                                    viewBox="0 0 16 16"
                                  >
                                    {" "}
                                    <path
                                      d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"
                                      fill="#f3da35"
                                    ></path>{" "}
                                  </svg>
                                )}
                              </td>
                              <td
                                class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold font-mono  text-opacity-100 text-cyan-700 px-6 scale-95 hover:scale-100 transition duration-150 ease-in-out
"
                              >
                                <a href="#">
                                  View
                                  <span aria-hidden="true" className="ml-1">
                                    →
                                  </span>
                                </a>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <>
                            {/* will have the search logic here */}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-8 w-full mt-3">
            <IconButton
              size="sm"
              variant="outlined"
              onClick={prev}
              disabled={active === 1}
              className="bg-white hover:bg-sky-300/20 transition ease-in-out"
            >
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
            <Typography color="gray" className="font-normal">
              Page <strong className="text-gray-900">{active}</strong> of{" "}
              <strong className="text-gray-900">10</strong>
            </Typography>
            <IconButton
              size="sm"
              variant="outlined"
              onClick={next}
              disabled={active === 10}
              className="bg-white hover:bg-sky-300/20 transition ease-in-out"
            >
              <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </IconButton>
          </div>
        </>
      )}
    </>
  );
};

export default History;
