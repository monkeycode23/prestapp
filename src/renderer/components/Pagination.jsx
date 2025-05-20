import { current } from "@reduxjs/toolkit";
import React,{useState} from "react";


  

  function Pagination({currentPage,totalPages,changePage}) {
    
    const elipsePagination=()=>{

      const firstPages= (
       <>
        <button
        
        className={`px-3 py-1 mx-1 rounded-full ${
          currentPage === 1
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => changePage(1)}
      >
        1
      </button>
      <button
        
        className={`px-3 py-1 mx-1 rounded-full ${
          currentPage === 2
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => changePage(2)}
      >
        2
      </button>
      <button
        
        className={`px-3 py-1 mx-1 rounded-full ${
          currentPage === 3
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => changePage(3)}
      >
        3
      </button>
       </>
      )

      const lastPages= (
        <>
         <button
         className={`px-3 py-1 mx-1 rounded-full ${
           currentPage === totalPages-1
             ? "bg-blue-500 text-white"
             : "bg-gray-200 text-gray-700 hover:bg-gray-300"
         }`}
         onClick={() => changePage(totalPages-1)}
       >
         {totalPages-1}
       </button>
       <button
         
         className={`px-3 py-1 mx-1 rounded-full ${
           currentPage === totalPages
             ? "bg-blue-500 text-white"
             : "bg-gray-200 text-gray-700 hover:bg-gray-300"
         }`}
         onClick={() => changePage(totalPages)}
       >
         {totalPages}
       </button>
      
        </>
       )


       return (<>
        {firstPages}
        {
          currentPage>3  && currentPage<(totalPages-1)?
          (<>
          ...
          <button
        
        className={`px-3 py-1 mx-1 rounded-full  bg-blue-500 text-white hover:bg-gray-300`}
       /*  onClick={() => changePage(currentPage)} */
      >
        {currentPage}
      </button>
         ... </>)
          :
          (<>...</>)
        }
        {lastPages}
       </>)
    }

    return (
      <>
      
      
        {/* Paginación */}
        <div className="">
          <button
            className={`px-3 py-1 mx-1 rounded-full ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
          >
            &lt;  
          </button>
          {
            totalPages<7 ? (
              Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 mx-1 rounded-full ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => changePage(i + 1)}
                >
                  {i + 1}
                </button>
              ))
            ):(<>
            
            {elipsePagination()}
            </>)
          }
          <button
            className={`px-3 py-1 mx-1 rounded-full ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={currentPage === totalPages}
            onClick={() =>changePage(currentPage+1)}
          >
         &gt;
          </button>
        </div>
      </>
    )
  }
  
  export default Pagination
  
  