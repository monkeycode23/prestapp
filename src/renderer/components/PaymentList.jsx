import React,{useEffect, useState} from "react";
import DropdownDefault from "./Dropdowns/DropdownDefault";
import paymentsModel from "../database/models/Payments";
import Pagination from "../components/Pagination"

import { formatAmount } from "../common/funcs";

const PaymentList = ({ payments }) => 
{

  const {page,limit,totalPages,setPage,search,setSearch,setPayments} = useTodayPayments()


  function changePage(page){
    setPage(page)
  }

  return (
  
    <div className="col-span-1  md:col-span-1 xl:col-span-1   bg-white  rounded-sm overflow-hidden">
      {/* Título */}
      <div className="  text-md font-semibold p-4 flex justify-between items-center">
        
        <h3>Lista de Cobranzas</h3>
        
        
        <input
                type="text"
                placeholder="Buscar..."
                className=" h-10  p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={async(e) => {

                
                  setSearch(e.target.value)
                  console.log(search)

                  setPayments(await paymentsModel.getTodayPayments(page,limit,seatch))

                }}
              />
        
         <Pagination currentPage={page} totalPages={totalPages} changePage={changePage}></Pagination>
      </div>
  
      {payments.map((payment) => (
        <PaymentListItem key={payment.id} payment={payment}></PaymentListItem>
      ))}
    </div>
  );
}



import { useTodayPayments } from "../pages/Payments";

export  function PaymentListItem({payment}) {

 // console.log(payment)
  const {setCount,setPayments,setTOdayGains,todayGains,setTodayAmount} = useTodayPayments()

  
  //console.log(paymentData)
  return (
    <div
        
        className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 hover:bg-gray-50"
      >
        {/* Información del cliente */}
        <div className="flex items-center w-1/4">
          {/* Icono de cliente */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A3.375 3.375 0 008.25 15h7.5a3.375 3.375 0 013.129 2.804M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9z"
            />
          </svg>
          <div>
            <h3 className="text-gray-700  text-md">
              {payment.nickname}
            </h3>
          </div>
        </div>
      
        <div className="flex items-center text-gray-500 w-1/4">
            
            <span className="text-sm font-semibold  font-medium">{payment.label}</span>
          </div>
        {/* Monto y estado */}
        <div className="flex items-center space-x-4 w-1/4">
          {/* Icono de monto */}
          <div className="flex items-center text-gray-500">
            
            <span className="text-lg font-semibold  font-medium">${formatAmount(payment.amount)}</span>
          </div>



          {/* Estado */}
          <div className="flex flex-end w-1/4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              payment.state === "pending"
                ? "bg-primary text-white"
                : payment.state=="incomplete" ? "bg-warning text-white":  "bg-green-100 text-green-600"
            }`}
          >
            {payment.state=="payed" ? "pagada" : payment.state=="incomplete" ? "incompleta" : "pendiente"}
          </span>
          </div>
        </div>

        {/* Botón de acción */}
        
        <DropdownDefault right={true}>
        <button

           /*  disabled={payment.state === "payed"} */
            className={`flex items-center px-4 py-2  font-medium `}

            onClick={async ()=>{

              console.log(`Pagando ${payment.nickname}`)
              //console.log(payment)
              //console.log(payment.paymentId)
              const p = payment.state=="pending" ? "payed": payment.state=="incomplete" ? "payed" : "pending"
              console.log(p)
              
              if(payment.state=="pending"){
                 paymentsModel.payPayment(payment.paymentId)

                 setTOdayGains((prev)=>todayGains+payment.gains)
                 setTodayAmount((prev)=>prev+payment.amount)
              }
              else if(payment.state=="incomplete"){
                console.log(p)
                paymentsModel.editPayment(payment.paymentId,{
                  state:"payed",
                 
                  
                })

                setTOdayGains((prev)=>todayGains+payment.gains)
                 setTodayAmount((prev)=>prev+payment.amount)
              }
              else{
                paymentsModel.editPayment(payment.paymentId,{
                  state:"pending",
                  payed_date:null
                })

                setTOdayGains((prev)=>todayGains -payment.gains)
                setTodayAmount((prev)=>prev-payment.amount)
              }
              


              setPayments((prev)=>prev.map((e)=>{
                
                console.log(e.id)
                return e.paymentId == payment.paymentId ? {
                  ...e,
                  state:p
                } : e
              }))
              
              setCount((prev)=>prev+1)
            }}
            >
            {/* Icono de pagar */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H9m3 9a9 9 0 100-18 9 9 0 000 18zm0-18v18"
              />
            </svg>
            {payment.state == "pending" ? "pagar":payment.state == "incomplete" ? "pagar" : "pending"}
            </button>




            <IncompleteModal payment={payment}  button={<button

              /*  disabled={payment.state === "payed"} */
              className={`flex items-center px-4 py-2  font-medium ${payment.state == "payed" ? "opacity-25":""}  `}

              disabled={payment.state == "payed"}
              >
              {/* Icono de pagar */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m3 9a9 9 0 100-18 9 9 0 000 18zm0-18v18"
                />
              </svg>
              incompleto
              </button>}>

            </IncompleteModal>

            

        </DropdownDefault>
      </div>
  )
}


import IncompleteModal from "../pages/Payments/IncompleteModal";

export const PaymentCard = ({ payments, handleCancel }) => (
  <div className="max-w-4xl mx-auto mt-8 space-y-4">
    {payments.map((payment) => (
      <div
        key={payment.id}
        className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-lg p-4 border hover:bg-gray-50 transition"
      >
        {/* Información del cliente */}
        <div className="flex items-center w-full md:w-1/3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A3.375 3.375 0 008.25 15h7.5a3.375 3.375 0 013.129 2.804M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700">
            {payment.clientName}
          </h3>
        </div>

        {/* Información del monto */}
        <div className="flex items-center w-full md:w-1/4 mt-3 md:mt-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z"
            />
          </svg>
          <span className="text-lg font-medium text-gray-800">
            ${payment.amount}
          </span>
        </div>

        {/* Estado */}
        <div className="flex items-center w-full md:w-1/4 mt-3 md:mt-0">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              payment.status === "Pendiente"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {payment.status}
          </span>
        </div>

        {/* Botón de acción */}
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => handleCancel(payment.id)}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Anular Pago
          </button>
        </div>
      </div>
    ))}
  </div>
);




export default PaymentList;

