import React,{useState,useEffect} from 'react'
import Modal,{ useModal } from '../../components/Modal'
import { PaymentIcon, CalendarDateIcon, MoneyBillAlt } from '../../components/Icons'

import { StateTag } from './PaymentsList'

import { formatAmount } from '../../common/funcs'
import { formatDateDifference } from '../../common/funcs'

import { getNotes } from './funcs'
import { useSelector,useDispatch } from 'react-redux'
import { setNotes } from '../../redux/reducers/notes'

function PaymentModal({payment,button}) {
   const notes = useSelector(state=>state.notes.notes)
   const dispatch = useDispatch()

   useEffect(()=>{
    const init = async ()=>{
        const notes = await getNotes(payment.id,"payment")
        dispatch(setNotes(notes))
    }
    init()
   },[])

   const getPaymentTimingStatus = () => {
     if (!payment.paid_date || payment.paid_date === "NULL") return null;
     
     const paymentDate = new Date(payment.payment_date);
     const paidDate = new Date(payment.paid_date);
     
     if (paidDate < paymentDate) {
       return {
         text: "Pagado por adelantado",
         color: "text-green-600",
         icon: "text-green-600"
       };
     } else if (paidDate > paymentDate) {
       return {
         text: "Pagado con atraso",
         color: "text-red-600",
         icon: "text-red-600"
       };
     } else {
       return {
         text: "Pagado en fecha",
         color: "text-blue-600",
         icon: "text-blue-600"
       };
     }
   };
  
  return (
    <Modal buttonLabel={"ver"} title={payment.label} button={button}>
        <div className='flex flex-col gap-6'>
          {/* Header con ícono y monto */}
          <div className='flex gap-3 items-center'>
            <div className="bg-lime-500 text-white w-30 h-30 flex flex-row justify-center items-center rounded-full">
              <PaymentIcon width={33} height={33}/>
            </div>

            <div className='flex flex-col gap-2'>
              <div className='w-full'>
                <span className='text-center text-3xl text-green-500'>{"$"+formatAmount(payment.amount)} </span>
                <span className="text-gray-600">{"(ganancia $"+payment.gain+")"}</span>
              </div>
              <div className='w-full'>
                <StateTag state={payment.status} />
              </div>
            </div>
          </div>

          {/* Información detallada */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              <CalendarDateIcon width={20} height={20} className="text-gray-600"/>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-600'>Fecha de pago</span>
                <span className='text-md text-black'>{payment.payment_date}</span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <MoneyBillAlt width={20} height={20} className="text-gray-600"/>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-600'>Estado del pago</span>
                <span className='text-md text-black'>
                  {payment.status === "paid" ? 
                    new Date(payment.payment_date) > new Date() ? 
                      "Pago adelantado" : 
                      "Pagado hace " + formatDateDifference(payment.payment_date) :
                    payment.status === "pending" ? 
                      "Se paga en " + formatDateDifference(payment.payment_date) :
                    payment.status === "expired" ? 
                      "Atrasado hace " + formatDateDifference(payment.payment_date) :
                    payment.status === "incomplete" ? 
                      "Pago incompleto" : ""
                  }
                </span>
              </div>
            </div>

            {payment.status === "incomplete" && (
              <div className='flex items-center gap-2 col-span-2'>
                <MoneyBillAlt width={20} height={20} className="text-yellow-600"/>
                <div className='flex flex-col'>
                  <span className='text-sm text-gray-600'>Monto pagado (recargo)</span>
                  <span className='text-md text-yellow-600 font-bold'>
                    ${formatAmount(payment.incomplete_amount || (payment.amount * 0.3))}
                  </span>
                </div>
              </div>
            )}

            {payment.paid_date && payment.paid_date !== "NULL" && (
              <>
                <div className='flex items-center gap-2 col-span-2'>
                  <CalendarDateIcon width={20} height={20} className="text-green-600"/>
                  <div className='flex flex-col'>
                    <span className='text-sm text-gray-600'>Fecha de pago realizado</span>
                    <span className='text-md text-green-600'>{payment.paid_date}</span>
                  </div>
                </div>

                {getPaymentTimingStatus() && (
                  <div className='flex items-center gap-2 col-span-2'>
                    <MoneyBillAlt width={20} height={20} className={getPaymentTimingStatus().icon}/>
                    <div className='flex flex-col'>
                      <span className='text-sm text-gray-600'>Estado de pago</span>
                      <span className={`text-md font-semibold ${getPaymentTimingStatus().color}`}>
                        {getPaymentTimingStatus().text}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Notas */}
          {notes && (
            <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
              <span className='text-md font-semibold text-gray-700'>Notas:</span>
              <p className='mt-2 text-gray-600'>
                {payment.notes}
              </p>
            </div>
          )}
        </div>
    </Modal>
  )
}

export default PaymentModal