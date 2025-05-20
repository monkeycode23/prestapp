import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/reducers/_pagination";




export default function PaymentsFilter () {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.pagination.filter);

  useEffect(() => {
     
      

    //const f = filter?.status
    if(Object.keys(filter).length>0 && !Object.keys(filter.status).includes("pending") ){
      console.log("asdasdasd");
      dispatch(setFilter({
        status: {
          pending: true,
          paid: true,
          expired:true,
          incomplete:true,
        },
        dates: {
          from: '',
          to: '',
        },
        

      }))
    }
  }, [filter]);

  return (
    <>

    <div className="flex flex-col shadow-xl p-2 rounded-lg border border-stroke ">
      <h1 className="text-xl font-bold mb-3">Filtros</h1>

      <StateFilter />
      <div className="flex flex-col mb-3">
        <h2 className="text-sm font-bold ">Fecha</h2>
        <div className="flex flex-col p-2">
          
          <input
            name="loan_date"
            type="date"
            placeholder="desde"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent p-1 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) =>
              dispatch(
                setFilter({
                  ...filter,
                  dates: {
                    ...filter.dates,
                    from: e.target.value,
                  },
                })
              )
            }
            defaultValue={filter.dates?.from}
            value={filter.dates?.from}
          />
         
          <input
            name="loan_date"
            type="date"
            placeholder="hasta"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent p-1 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) =>
              
                setFilter({
                  ...filter,
                  dates: {
                    ...filter.dates,
                    to: e.target.value,
                  },
                })
              }
            defaultValue={filter.dates?.to}
            value={filter.dates?.to}
          />
        </div>
      </div>


   

    </div>

    </>
  );
};



export function StateFilter() {

  const filter = useSelector((state) => state.pagination.filter);
  const dispatch = useDispatch();



  function toggle(state){
   // setFilterState({...filterState, [state]:!filter[state]})
    //console.log(filterState)

    dispatch(setFilter({...filter,  status: {
        ...filter?.status,
        [state]: !filter?.status[state]
      }}))
  }

 
  return (
    <div className="flex flex-col mb-3">
        <h2 className="text-sm font-bold">Estado</h2>
        <div className="flex flex-col justify-start items-start p-2">
          <button
          onClick={() => {
            toggle('pending')
            console.log(filter)
          }}

          className={`p-1 w-full text-left text-primary    rounded-lg
            ${filter.status?.pending ? 'bg-primary text-white' : ' text-gray-500'}
            `}>Pendientes</button>
          <button 
          onClick={() => toggle('paid')}
          className={`p-1 w-full text-left text-success rounded-lg
            ${filter.status?.paid ? 'bg-success text-white' : ' text-gray-500'}
            `}>Pagados</button>
          <button 
          onClick={() => toggle('expired')}
              className={`p-1 w-full text-left text-danger rounded-lg
                ${filter.status?.expired ? 'bg-danger text-white' : ' text-gray-500'}
            `}>Vencidos</button>
             <button 
          onClick={() => toggle('incomplete')}
              className={`p-1 w-full text-left text-warning rounded-lg
                ${filter.status?.incomplete ? 'bg-warning text-white' : ' text-gray-500'}
            `}>Incompletos</button>
        </div>
      </div>

  )
}
