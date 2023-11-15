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

        
<div class="flex flex-col mt-8">
  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8 flex justify-center items-center">
    <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div class="mx-[10%] overflow-hidden">
        <table class="min-w-full text-left text-sm font-light">
          <thead class="border-b font-medium dark:border-sky-500">
            <tr>
              <th scope="col" class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6">Name</th>
              <th scope="col" class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"><p className='hidden'>Date</p></th>
              <th scope="col" class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6">Node</th>
              <th scope="col" class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6">Edges</th>
              <th scope="col" class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6">Time Complexity</th>
              <th scope="col" class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6">Space Complexity</th>
              <th scope="col" class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6"><p className='hidden'>favourite</p></th>
              <th scope="col" class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-sky-500 px-6"><p className='hidden'>Visit</p></th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b dark:border-sky-200/80">
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6">dijkstra-01</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-light font-mono text-opacity-100 text-gray-400 px-6">11/15/2023, 08:30 PM</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono text-opacity-100 text-gray-700 px-6">3</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono  text-opacity-100 text-gray-700 px-6">3</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono  text-opacity-100 text-gray-700 px-6">12321ms</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono  text-opacity-100 text-gray-700 px-6">12.2MB</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono text-opacity-100 text-gray-700 px-6">
              {true ? 
                <svg className="text-[#f3da35]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16"> <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" fill="#f3da35"></path> </svg>
                : 
                <svg className="text-[#f3da35]"  xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16"> <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" fill="#f3da35"/> </svg>
                }
              </td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold font-mono  text-opacity-100 text-cyan-700 px-6 scale-95 hover:scale-100 transition duration-150 ease-in-out
              "><a href='#'>View<span aria-hidden="true" className='ml-1'>→</span></a>
            </td>
            </tr>
            

            <tr class="border-b dark:border-sky-200/80">
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6">dijkstra-01</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-light font-mono text-opacity-100 text-gray-400 px-6">11/15/2023, 08:30 PM</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono text-opacity-100 text-gray-700 px-6">3</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono  text-opacity-100 text-gray-700 px-6">3</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono  text-opacity-100 text-gray-700 px-6">12321ms</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono  text-opacity-100 text-gray-700 px-6">12.2MB</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono text-opacity-100 text-gray-700 px-6">
              {false ? 
                <svg className="text-[#f3da35]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16"> <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" fill="#f3da35"></path> </svg>
                : 
                <svg className="text-[#f3da35]"  xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16"> <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" fill="#f3da35"/> </svg>
                }
              </td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold font-mono  text-opacity-100 text-cyan-700 px-6 scale-95 hover:scale-100 transition duration-150 ease-in-out
              "><a href='#'>View<span aria-hidden="true" className='ml-1'>→</span></a>
            </td>
            </tr>


            <tr class="border-b dark:border-sky-200/80">
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold text-opacity-100 text-gray-700 px-6">dijkstra-01</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-light font-mono text-opacity-100 text-gray-400 px-6">11/15/2023, 08:30 PM</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono text-opacity-100 text-gray-700 px-6">3</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono  text-opacity-100 text-gray-700 px-6">3</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono  text-opacity-100 text-gray-700 px-6">12321ms</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono  text-opacity-100 text-gray-700 px-6">12.2MB</td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-semibold font-mono text-opacity-100 text-gray-700 px-6">
              {true ? 
                <svg className="text-[#f3da35]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16"> <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" fill="#f3da35"></path> </svg>
                : 
                <svg className="text-[#f3da35]"  xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16"> <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" fill="#f3da35"/> </svg>
                }
              </td>
              <td class="py-[0.875rem] pl-[1rem] pr-[0.75rem] text-left text-[0.875rem] leading-5 font-bold font-mono  text-opacity-100 text-cyan-700 px-6 scale-95 hover:scale-100 transition duration-150 ease-in-out
              "><a href='#'>View<span aria-hidden="true" className='ml-1'>→</span></a>
            </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
    </>
  )
}

export default History
