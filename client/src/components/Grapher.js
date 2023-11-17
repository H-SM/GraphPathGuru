import React, { useContext, useEffect } from 'react'
import Navbar from './Navbar'
import { useParams } from 'react-router-dom';
import graphContext from "../context/Graph/graphContext.js";
import userContext from "../context/User/userContext.js";

const Grapher = () => {
    const { id } = useParams();
    const contextgraph = useContext(graphContext);
    const contextuser = useContext(userContext);

    const { getgraph, viewGraph } = contextgraph;
    const { usershower, showUser, setShowUser } = contextuser;

    useEffect(() => {
        const fetchGraph = async () => {
          try {
            await getgraph(id);
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchGraph();
      }, [id]);
      
      useEffect(() => {
        // Ensure viewGraph.user is available and not undefined
        if (viewGraph && viewGraph.user) {
          const fetchUser = async () => {
            try {
              await usershower(viewGraph.user);
            } catch (error) {
              console.error(error);
            }
          };
      
          fetchUser();
        }
      }, [viewGraph]);

    //   useEffect(() => {
    //     // Use a conditional check to prevent recursive calls
    //     if (!viewGraph || viewGraph._id !== id) {
    //       getgraph(id);
    //     }
      
    //     // Cleanup function
    //     return ;
    //   }, [id, viewGraph, getgraph]);
    
    console.log(id, viewGraph, showUser);
    


  return (
    <div>
        <Navbar/>
        this is the graph Page!
    </div>
  )
}

export default Grapher
