import React, { useContext, useEffect, useState } from "react";
import graphContext from "../context/Graph/graphContext.js";
import { useNavigate } from "react-router-dom";


const HistoryItem = (props) => {
    let context = useContext(graphContext);
    const navigate = useNavigate();
    const { editfavgraph, editname } = context;

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

      const maxLengthCheck = (e) => {
        if (e.target.value.length > e.target.maxLength) {
         e.target.value = e.target.value.slice(0, e.target.maxLength)
          }
        }
    
      const handleNameChange = () => {
        setNamechanger(!namechanger);
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

  const [namechanger,setNamechanger] = useState(false);
  const [newname, setNewname ] = useState('');

  const onChange = (e) =>{
    setNewname(e.target.value);
  }

  const handleclick = () =>{
    if(newname !== ''){
      editname(graph._id, newname);
    }else{
      alert("the feild was empty!");
    }
    setNamechanger(!namechanger);
  }

  // useEffect(() =>{
  //   console.log(graph._id);
  // },[props])

  // Extract TC and SC from the result string
  const resultArray = graph.result
    .split("\n")
    .filter((item) => item.trim() !== "");
  const tc = resultArray[1]?.trim() || "N/A";
  const sc = resultArray[2]?.trim() || "N/A";
  return (
    <tr class="border-b dark:border-sky-200/80">
      <td class="relative py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6 w-[18rem] hover:cursor-pointer" onClick={() => {
        if(namechanger === false) handleNameChange();
        }}>
        {namechanger ? 
        <div className="flex flex-row w-[24vh]">  
          <div className="relative w-[22vh] h-[3vh] ">
          <input id="nameinp" type ="string" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1" maxLength = "25" onInput={maxLengthCheck}
          //  value={newname}
          onChange={onChange} placeholder={graph.name}
           />
          <label htmlFor="nameinp" className="absolute bottom-0 right-2 text-gray-700/30 text-md font-semibold">{25 - newname.length}</label>
          </div>
          <div className="flex items-center justify-center h-[3vh]">
          <button className="w-[2vh] " onClick={handleNameChange}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition ease-in-out duration-200 scale-90 hover:scale-100"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 5L19 19M5 19L19 5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </button>

          <button className="w-[2vh] transition ease-in-out duration-200 scale-90 hover:scale-100" onClick={handleclick}>
          <svg viewBox="0 -0.5 25 25" className="hover:scale-100 scale-95  w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.5 12.5L10.167 17L19.5 8" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </button>

          </div>
        </div>
        : 
        graph.name
        }
        {/* //TODO: have an update name path in the API */}
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
        class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold font-mono  text-opacity-100 text-cyan-700 px-6 flex flex-row gap-3"
      >
        <button className="scale-95 hover:scale-100 transition duration-150 ease-in-out" onClick={() => navigate(`/graph/${graph._id}`)}>
          View
          <span aria-hidden="true" className="ml-1">
            →
          </span>
        </button>
        <button className=" transition duration-150 ease-in-out opacity-30 hover:opacity-90" onClick={() => navigator.clipboard.writeText(`http://localhost:3000/graph/${graph._id}`)}>
          <div>
        <svg viewBox="0 -0.5 25 25" fill="none" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5 6.25C12.9142 6.25 13.25 5.91421 13.25 5.5C13.25 5.08579 12.9142 4.75 12.5 4.75V6.25ZM20.25 12.5C20.25 12.0858 19.9142 11.75 19.5 11.75C19.0858 11.75 18.75 12.0858 18.75 12.5H20.25ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM15.412 4.75C14.9978 4.75 14.662 5.08579 14.662 5.5C14.662 5.91421 14.9978 6.25 15.412 6.25V4.75ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.641C18.75 10.0552 19.0858 10.391 19.5 10.391C19.9142 10.391 20.25 10.0552 20.25 9.641H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM11.9697 11.9697C11.6768 12.2626 11.6768 12.7374 11.9697 13.0303C12.2626 13.3232 12.7374 13.3232 13.0303 13.0303L11.9697 11.9697ZM12.5 4.75H9.5V6.25H12.5V4.75ZM9.5 4.75C6.87665 4.75 4.75 6.87665 4.75 9.5H6.25C6.25 7.70507 7.70507 6.25 9.5 6.25V4.75ZM4.75 9.5V15.5H6.25V9.5H4.75ZM4.75 15.5C4.75 18.1234 6.87665 20.25 9.5 20.25V18.75C7.70507 18.75 6.25 17.2949 6.25 15.5H4.75ZM9.5 20.25H15.5V18.75H9.5V20.25ZM15.5 20.25C18.1234 20.25 20.25 18.1234 20.25 15.5H18.75C18.75 17.2949 17.2949 18.75 15.5 18.75V20.25ZM20.25 15.5V12.5H18.75V15.5H20.25ZM19.5 4.75H15.412V6.25H19.5V4.75ZM18.75 5.5V9.641H20.25V5.5H18.75ZM18.9697 4.96967L11.9697 11.9697L13.0303 13.0303L20.0303 6.03033L18.9697 4.96967Z" fill="#000000"></path> </g></svg>
        </div>
        </button>
      </td>
    </tr>
  );
};

export default HistoryItem;
