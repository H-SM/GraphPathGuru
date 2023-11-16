import React, { useState } from "react";
import graphContext from "./graphContext";
const GraphState = (props) =>{
    const host = process.env.REACT_APP_BACKEND_LOCALHOST;
    const [graphs , setGraphs] = useState([]); 

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

    
    //update favourite feild for the graph
    const editfavgraph = async (id, favourite) =>{
      let newGraphs = JSON.parse(JSON.stringify(graphs));

      for (let index = 0; index < newGraphs.length; index++) {
        const element = newGraphs[index];
        if(element._id === id){
          newGraphs[index].favourite = favourite;
          break;
        }
      }
      setGraphs(newGraphs);
      //API call
      await fetch(`${host}/api/graph/updatefavgraph/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token" : localStorage.getItem("token")
        },
        body: JSON.stringify({ favourite }) 
      });
  }
    return (
    <graphContext.Provider value={{graphs,setGraphs,getallgraph,addgraph,editfavgraph}}>
        {props.children}
    </graphContext.Provider>
    );
}

export default GraphState