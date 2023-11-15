import React, { useContext, useEffect } from 'react'
import graphContext from "../context/Graph/graphContext.js";
import { useNavigate } from 'react-router-dom';

const History = () => {
    let context = useContext(graphContext);
    let navigate = useNavigate();
   
    const { graphs, getallgraph } = context;
    useEffect(()=>{
        if(localStorage.getItem('token')){
            getallgraph();
        }else{
          navigate('/login');
        }
        // eslint-disable-next-line
      },[]);    
    console.log(graphs);
  return (
    <>
      <div id="team" class="relative z-20 mx-auto max-w-container px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8"><div class="mx-auto max-w-[45rem] text-center"><h1 class="text-base font-semibold leading-7 text-sky-500">What all you did before?</h1><p class="mt-4 text-5xl font-extrabold leading-[3.5rem] tracking-tight text-slate-900">Your History.</p><p class="mt-4 text-lg text-slate-700"> Explore your journey through captivating graphs! Your user history showcases the beautiful tapestry of charts and insights you've woven in our application. Each data point tells a unique story, a testament to your exploration and growth.</p></div></div>

    </>
  )
}

export default History
