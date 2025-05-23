import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setFilter } from "../../../redux/reducers/_pagination";

export const Filter = () => {

  const pagination = useSelector((state) => state.pagination);

  const dispatch = useDispatch();


  useEffect(() => {
    console.log("pagination:----------------------------->",pagination)
const f = pagination.filter.status ?? undefined

if(!f){
  dispatch(setFilter({
    ...pagination.filter,
    status: {
        completed:true,
        canceled:true,
        active: true
      },
      dates: {
        from: '',
        to: ''
      },
      amount: {
        from: 0,
        to: 0
      },
      installments: {
        from: 0,
        to: 0
      },
      interestRate:0
    }))
  }

  }, [pagination])



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
                  ...pagination.filter,
                  dates: {
                    ...pagination.filter.dates,
                    from: e.target.value,
                  },
                })
              )
            }
            defaultValue={pagination.filter.dates?.from}
            value={pagination.filter.dates?.from}
          />
         
          <input
            name="loan_date"
            type="date"
            placeholder="hasta"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent p-1 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) =>
              
                dispatch(setFilter({
                  ...pagination.filter,
                  dates: {
                    ...pagination.filter?.dates,
                    to: e.target.value,
                  },
                }))
              }
            defaultValue={pagination.filter.dates?.to}
            value={pagination.filter.dates?.to}
          />
        </div>
      </div>


      <div className="flex flex-col mb-3">
        <h2 className="text-sm font-bold ">Monto</h2>
        <div className="flex flex-col p-2">
           <input
            step={1000}
            name="monto"
            type="number"
            min={5000}
            placeholder="desde"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent p-1 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) => {
              dispatch(setFilter({
                ...pagination.filter,
                amount: {
                  ...pagination.filter.amount,
                from: e.target.value,
              },
            }))    
          }}
            defaultValue={pagination.filter.amount?.from}
            value={pagination.filter.amount?.from}
          />

<input
            step={1000}
            name="monto"
            type="number"
            min={5000}
            placeholder="hasta"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent p-1 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) => {
              dispatch(setFilter({
                ...pagination.filter,
                amount: {
                  ...pagination.filter.amount,
                to: e.target.value,
              },
            }))    
          }}
            defaultValue={pagination.filter.amount?.to}
            value={pagination.filter.amount?.to}
          />

          
        </div>
      </div>


      <div className="flex flex-col mb-3">
        <h2 className="text-sm font-bold ">Cantidad de cuotas</h2>
        <div className="flex flex-col p-2">
        <input
            step={1}
            name="monto"
            type="number"
            min={0}
            placeholder="desde"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent p-1 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) => {
              dispatch(setFilter({
                ...pagination.filter,
                installments: {
                ...pagination.filter.installments,
                from: e.target.value,
              },
            }))
          }}
            defaultValue={pagination.filter.installments?.form}
            value={pagination.filter.installments?.from}
          />

<input
            step={1}
            name="monto"
            type="number"
            min={0}
            placeholder="desde"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent p-1 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) => {
              dispatch(setFilter({
                ...pagination.filter,
                installments: {
                ...pagination.filter.installments,
                to: e.target.value,
              },
              }))
          }}
            defaultValue={pagination.filter.installments?.to}
            value={pagination.filter.installments?.to}
          />
        </div>
      </div>
      <div className="flex flex-col mb-3">
        <h2 className="text-sm font-bold">Tasa de interes</h2>
        <div className="flex flex-col p-2">
          
        <input
            step={1}
            name="monto"
            type="number"
            min={0}
            placeholder="porcentage"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent p-1 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) => {
              dispatch(setFilter({
                ...pagination.filter,
                interestRate: e.target.value,
              }))
          }}
            defaultValue={30}
            value={pagination.filter?.interestRate}
          />
        </div>
      </div>
    </div>
    </>
  );
};



export default function StateFilter() {

  const dispatch = useDispatch();

  const pagination = useSelector((state) => state.pagination);

  function toggle(state){
    console.log("state:----------------------------->",pagination.filter)
    dispatch(setFilter({
      ...pagination.filter,
      status: {
        ...pagination.filter?.status,
        [state]: !pagination.filter?.status[state]
      }
    }))
  }

 
  return (
    <div className="flex flex-col mb-3">
        <h2 className="text-sm font-bold">Estado</h2>
        <div className="flex flex-col justify-start items-start p-2">
          <button
          onClick={() => toggle('active')}

          className={`p-1 w-full text-left text-primary    rounded-lg
            ${pagination.filter?.status?.active  ? 'bg-primary text-white' : ' text-gray-500'}
            `}>Activos</button>
          <button 
          onClick={() => toggle('canceled')}
          className={`p-1 w-full text-left text-danger rounded-lg
            ${pagination.filter?.status?.canceled ? 'bg-danger text-white' : ' text-gray-500'}
            `}>Cancelados</button>
          <button 
          onClick={() => toggle('completed')}
              className={`p-1 w-full text-left text-success rounded-lg
                ${pagination.filter?.status?.completed ? 'bg-success text-white' : ' text-gray-500'}
            `}>Completados</button>
        </div>
      </div>

  )
}
