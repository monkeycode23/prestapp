


import React from 'react'



function List({data}) {
  return (
     <div className="col-span-6  md:col-span-6 xl:col-span-2 max-w-3xl  bg-white  rounded-sm overflow-hidden">
        {/* Título */}
        <div className=" text-md font-semibold p-4 flex items-center">
          
          <h3>Ultimos Prestamos </h3>
        </div>
    
        {loans.length>0 ? loans.map((loan) => (
          <LoansListItem key={loan.id} loan={loan}></LoansListItem>
        )): (
          <div className='flex justify-center items-center p-10 '>
    
              <span className='text-xl text-gray-300' >No hay Prestamos Registrados</span>
          </div>
        )}
      </div>
  )
}

export default List