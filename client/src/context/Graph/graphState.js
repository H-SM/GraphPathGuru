import React, { useState } from "react";
import graphContext from "./graphContext";
const GraphState = (props) => {
  const host = process.env.REACT_APP_BACKEND_LOCALHOST;
  const [graphs, setGraphs] = useState([]);
  const [viewGraph, setViewGraph] = useState([]);

  const getallgraph = async () => {
    const response = await fetch(`${host}/api/graph/fetchallgraphs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    setGraphs(json);
  };

  //add a note
  const addgraph = async (result, graph, name, favourite) => {
    //API call
    const response = await fetch(`${host}/api/graph/addgraph/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ result, graph, name, favourite }),
    });
    const grapher = await response.json();
    setGraphs(graphs.concat(grapher));
  };

  //update favourite feild for the graph
  const editfavgraph = async (id, favourite) => {
    let newGraphs = JSON.parse(JSON.stringify(graphs));

    for (let index = 0; index < newGraphs.length; index++) {
      const element = newGraphs[index];
      if (element._id === id) {
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
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ favourite }),
    });
  };

  const getgraph = async (id) => {
    const req = await fetch(`${host}/api/graph/getgraph/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await req.json();

    if (response.success === "graph given" && response.graph) {
      setViewGraph(response.graph);
    } else {
      console.error("Error fetching graph data");
    }
  };
  const editname = async (id, name) => {
    let newGraphs = JSON.parse(JSON.stringify(graphs));

    for (let index = 0; index < newGraphs.length; index++) {
      const element = newGraphs[index];
      if (element._id === id) {
        newGraphs[index].name = name;
        break;
      }
    }
    setGraphs(newGraphs);

    await fetch(`${host}/api/graph/updatenamegraph/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ name }),
    });
  };
  return (
    <graphContext.Provider
      value={{
        graphs,
        setGraphs,
        getallgraph,
        addgraph,
        editfavgraph,
        getgraph,
        viewGraph,
        setViewGraph,
        editname,
      }}
    >
      {props.children}
    </graphContext.Provider>
  );
};

export default GraphState;
