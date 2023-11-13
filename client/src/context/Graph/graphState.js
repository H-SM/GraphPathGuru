import React, { useState } from "react";
import GraphContext from "./graphContext";
const GraphState = (props) =>{
    const host = process.env.REACT_APP_BACKEND_HOST;
    const [graphs , setGraphs] = useState([]); 
    const [searchedGraph,setSearchedGraph]=useState("");

    const getallgraph = async () =>{
    
              const response = await fetch(`${host}/api/notes/fetchallgraphs`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "auth-token" : localStorage.getItem("token")
                }
              });
              const json = await response.json();

              setGraphs(json);
    }

    //add a note 
    const addgraph = async (result, graph) =>{
      //API call
      const response = await fetch(`${host}/api/notes/addgraph/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token" : localStorage.getItem("token")
        },
        body: JSON.stringify({result, graph}) 
      });
      const grapher =await response.json(); 
      setGraphs(graphs.concat(grapher));
    }

    

    return (
    <GraphContext.Provider value={{graphs,setGraphs,searchedGraph,setSearchedGraph,getallgraph,addgraph }}>
        {props.children}
    </GraphContext.Provider>
    );
}

export default GraphState