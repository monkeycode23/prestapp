import React,{useEffect, useState} from "react";
import PaymentListItem from "./PaymentListItem";
import Pagination from "../../components/Pagination";
import { formatAmount } from "../../common/funcs";
import { useSelector,useDispatch } from "react-redux";
import {setPage,setSearch} from "../../redux/reducers/_pagination"

const PaymentList = ({date}) => 
{


  const pagination = useSelector((state) => state.pagination)
  const dispatch = useDispatch()
  const payments = useSelector((state) => state.payments.payments)


  //const {page,limit,totalPages,setPage,search,setSearch,setPayments} = useTodayPayments()


  function changePage(page){

    if(typeof page === "number"){
      console.log("page",page)
      dispatch(setPage(page))
    }
    else{
      console.log("page",page)
      const pageNumber = page()
      console.log("pageNumber",pageNumber)
      dispatch(setPage(pageNumber))
    }
  }

  return (
  
    <div className="col-span-1  md:col-span-2 xl:col-span-2   bg-white  rounded-sm overflow-hidden">
      {/* Título */}
      <h3 className="text-lg font-semibold p-4 flex justify-between items-center">
      Pagos  del dia {date.toDateString() === new Date().toDateString() ? "de hoy" : new Date(date).toLocaleDateString("es-ES", {
      weekday: "long", // Día de la semana (lunes, martes...)
      day: "numeric", // Día del mes (23)
      month: "long", // Mes (febrero, marzo...)
      year: "numeric" // Año (2025)
    })}

      </h3>
      <div className="  text-md font-semibold p-4 flex justify-between items-center">
         
        <input
                type="text"
                placeholder="Buscar por nombre..."
                className="w-3/5 h-10  p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={pagination.search}
                onChange={async(e) => {

                
                dispatch(setSearch(e.target.value))
                  //console.log(search)

                /*   setPayments(await paymentsModel.getTodayPayments(page,limit,seatch)) */

                }}
              />

              <div className="w-2/5">
              <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} changePage={changePage}></Pagination>

              </div>
        
      </div>
  
     {payments.map((payment) => (
        <PaymentListItem key={payment.id} payment={payment}></PaymentListItem> 
      ))} 
    </div>
  );
}











export default PaymentList;
