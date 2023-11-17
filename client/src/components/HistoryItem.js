import React, { useContext } from "react";
import graphContext from "../context/Graph/graphContext.js";
import { useNavigate } from "react-router-dom";


const HistoryItem = (props) => {
    let context = useContext(graphContext);
    const navigate = useNavigate();
    const { editfavgraph } = context;

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
  const { graph } = props;
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
        //TODO: have an update name path in the API
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
        onClick={() => {editfavgraph(graph._id,!graph.favourite)}}
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
        <button onClick={() => navigate(`/graph/${graph._id}`)}>
          View
          <span aria-hidden="true" className="ml-1">
            →
          </span>
        </button>
      </td>
    </tr>
  );
};

export default HistoryItem;
