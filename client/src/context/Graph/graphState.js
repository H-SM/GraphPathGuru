import React, { useState } from "react";
import graphContext from "./graphContext";
const GraphState = (props) =>{
    const host = process.env.REACT_APP_BACKEND_LOCALHOST;
    const [graphs , setGraphs] = useState([]); 
    const [searchedGraph,setSearchedGraph]=useState("");

    const getallgraph = async () =>{
    
       const response = await fetch(`${host}/api/graph/fetchallgraphs`, {
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
    const addgraph = async (result, graph, name, favourite) =>{
      //API call
      const response = await fetch(`${host}/api/graph/addgraph/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token" : localStorage.getItem("token")
        },
        body: JSON.stringify({result, graph, name, favourite}) 
      });
      const grapher =await response.json(); 
      setGraphs(graphs.concat(grapher));
    }

    

    return (
    <graphContext.Provider value={{graphs,setGraphs,searchedGraph,setSearchedGraph,getallgraph,addgraph }}>
        {props.children}
    </graphContext.Provider>
    );
}

export default GraphState