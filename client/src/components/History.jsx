import React, { useContext, useEffect, useState } from "react";
import graphContext from "../context/Graph/graphContext.js";
import { useNavigate } from "react-router-dom";
import { IconButton, Typography } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import HistoryItem from "./HistoryItem";

const History = () => {
  const [active, setActive] = useState(1);
  const [searchedGraph, setSearchedGraph] = useState("");
  const [sorterGraph, setSorterGraph] = useState("Time (new-to-old)");
  const itemsPerPage = 10;

  let context = useContext(graphContext);
  let navigate = useNavigate();

  const { graphs, getallgraph } = context;

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getallgraph();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const sortAndFilterGraphs = (graphs) => {
    switch (sorterGraph) {
      case "Time (new-to-old)":
        return graphs.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "Time (old-to-new)":
        return graphs.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "Favourites":
        return graphs
          .filter((graph) => graph.favourite === true)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      default:
        return graphs;
    }
  };
  let TotalSearched = sortAndFilterGraphs(graphs).filter((graph) =>
    graph.name.toLowerCase().includes(searchedGraph.toLowerCase())
  ).length;
  let totalPages = Math.max(Math.ceil(sortAndFilterGraphs(graphs).length / itemsPerPage),1);
  if (searchedGraph !== "") {
    totalPages = Math.ceil(TotalSearched / itemsPerPage);
  }
  //prevent overflow on shifting page sorting searches
  setTimeout(() => {
    if(active > totalPages) setActive(totalPages);
  },1000)
  const next = () => {
    if (active === totalPages) return;

    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;

    setActive(active - 1);
  };

  const startIndex = (active-1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return (
    <>
      <div id="history"
        className="relative z-20 mx-auto max-w-container px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8"
      >
        <div className="mx-auto max-w-[45rem] text-center">
          <h1 className="text-base font-semibold leading-7 text-sky-500">
            What all you did before?
          </h1>
          <p className="mt-4 text-5xl font-extrabold leading-[3.5rem] tracking-tight text-slate-900">
            Your History.
          </p>
          <p className="mt-4 text-lg text-slate-700">
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
        <div className="lg:h-[50rem] xl:h-[37rem]">
          {/* lg:h-[50rem] xl:h-[37rem] */}
          <div className="flex flex-col mt-8">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 flex-row justify-center items-center gap-y-3">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="mx-[10%] overflow-hidden">
                  <div className="flex flex-row justify-end my-1 sm:mb-0">
                    <div className="relative">
                      <select
                        className="appearance-none h-full rounded-md border-t sm:rounded-r-none sm:border-r-0 border-r border-b block w-full bg-white border-sky-700 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500 focus:ring-0 focus:ring-offset-0"
                        value={sorterGraph}
                        onChange={(e) => setSorterGraph(e.target.value)}
                      >
                        <option defaultChecked>Time (new-to-old) </option>
                        <option>Favourites</option>
                        <option>Time (old-to-new)</option>
                      </select>
                    </div>

                    <div className="block relative">
                      <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 fill-current text-gray-500"
                        >
                          <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                        </svg>
                      </span>
                      <input
                        placeholder="Search (Name)"
                        className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-sky-700 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none focus:ring-0 focus:ring-offset-0"
                        onChange={(e) => {
                          e.preventDefault();
                          setSearchedGraph(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b font-medium dark:border-sky-500">
                      <tr>
                        <th
                          scope="col"
                          className="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          <p className="hidden">Date</p>
                        </th>
                        <th
                          scope="col"
                          className="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          Number of Nodes
                        </th>
                        <th
                          scope="col"
                          className="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          Number of Edges
                        </th>
                        <th
                          scope="col"
                          className="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          Time Taken
                        </th>
                        <th
                          scope="col"
                          className="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          Space Taken
                        </th>
                        <th
                          scope="col"
                          className="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"
                        >
                          <p className="hidden">favourite</p>
                        </th>
                        <th
                          scope="col"
                          className="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-sky-500 px-6"
                        >
                          <p className="hidden">Visit</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchedGraph === "" ? (
                        sortAndFilterGraphs(graphs)
                          .map((graph, index) => {
                            return <HistoryItem graph={graph} key={index} />;
                          })
                          .slice(startIndex, endIndex)
                      ) : TotalSearched > 0 ? (
                        sortAndFilterGraphs(graphs)
                          .filter((graph) =>
                            graph.name
                              .toLowerCase()
                              .includes(searchedGraph.toLowerCase())
                          )
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((graph, index) => (
                            <HistoryItem graph={graph} key={index} />
                          ))
                          .slice(startIndex, endIndex)
                      ) : (
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <div className="w-[200px] text-black flex flex-col justify-center items-center">
                              <p className="w-full flex justify-center items-center font-bold text-gray-600 text-[15px] mt-[15vh] mb-[15vh]">
                                No such Graph exist.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div> 
          </div>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-8 w-full mt-3">
              <IconButton
                size="sm"
                variant="outlined"
                onClick={prev}
                disabled={active === 1}
                className="bg-white hover:bg-sky-300/20 transition ease-in-out disabled:opacity-0"
              >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
              </IconButton>
              <Typography color="gray" className="font-normal">
                Page <strong className="text-gray-900">{active}</strong> of{" "}
                <strong className="text-gray-900">{totalPages}</strong>
              </Typography>
              <IconButton
                size="sm"
                variant="outlined"
                onClick={next}
                disabled={active === totalPages}
                className="bg-white hover:bg-sky-300/20 transition ease-in-out disabled:opacity-0"
              >
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
              </IconButton>
            </div>
          )}
            <div>
          </div>
        </>
      )}
    </>
  );
};

export default History;
