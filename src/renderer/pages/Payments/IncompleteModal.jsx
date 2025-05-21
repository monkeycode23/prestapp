import React, { useState } from 'react'
import Modal from "../../components/Modal"
import { useModal } from '../../components/Modal'
import {useNotification} from "../../components/Notifications"
import { setBruteGains, setNetGains } from "../../redux/reducers/gains";

import { useDispatch, useSelector } from "react-redux";
import { setPayments,updatePayment,setPaymentsCount } from '../../redux/reducers/payments.jsx';
import { setNotes } from '../../redux/reducers/notes';

function IncompleteModal({payment,button}) {

    const {setNotification,showNotification} = useNotification()

  return (
    <Modal title={"Pago incompleto"} button={button}>
        <FormModal payment={payment} >

        </FormModal>
    </Modal>
  )
}


function FormModal({payment}) {

    const dispatch = useDispatch()
   // const {setPayments} = useTodayPayments()
    const {setNotification,showNotification} = useNotification()
    const {toggleModal} = useModal()
    const [monto,setMonto] = useState()
    const gains = useSelector((state)=>state.gains)
    const paymentsCount = useSelector((state)=>state.payments.paymentsCount)
     async function onClick(e) {
        e.preventDefault()
        

        
        await window.database.models.Payments.updatePayment({
            id:payment.id,
            status:"incomplete",
            incomplete_amount:monto,
            paid_date:"NULL",
        })

        await window.database.models.Loans.updateLoan({
            id:payment.loan_id,
            status:"active"
           
        })

        const   notes= "Pago incompleto,monto pagado "+monto+" resta por pagar "+(payment.amount-monto)+" para completar el pago (los pagos incompletos no estan acoplados al calculo de la ganancia)"

        await window.database.models.Notes.createNote({
            payment_id:payment.id,
            notes:notes
        })


        if(payment.status=="pending"){
        dispatch(
            setPaymentsCount({
              ...paymentsCount,
              pending: paymentsCount.pending - 1,
              incomplete: paymentsCount.incomplete + 1,
            })
          );
        }

        if(payment.status=="expired"){
            dispatch(
                setPaymentsCount({
                  ...paymentsCount,
                  expired: paymentsCount.expired - 1,
                  incomplete: paymentsCount.incomplete + 1,
                })
              );
            }
        /* dispatch(setBruteGains(gains.bruteGains + payment.gain));
        dispatch(setNetGains(gains.netGains + payment.amount));
 */
        dispatch(updatePayment({
            id:payment.id,
            payment:{
                ...payment,
            status:"incomplete",
            incomplete_amount:monto,
            paid_date:null,
            }
            
        }))


        dispatch(setNotes(notes))
        /* setPayments((prev)=>prev.map((e)=>{

            if(e.paymentId==payment.paymentId){
                return {
                    ...e,
                    state:"incomplete",
                    
                }
            }else{
                return e
            }
        })) */


        toggleModal()

         setNotification({
            type:"warning",
            message:"Pago marcado como incompleto"
        })
        showNotification()
    } 

  return (
   <>
    <form onSubmit={(e)=>e.preventDefault()} noValidate>
    <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                        monto 
                    </label>
                    <input
                        step={1000}
                        name="label"
                        type="number"
                        max={payment.amount}
                        placeholder="Ingresa el monto del pago"
                        className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                        onChange={(e) =>setMonto(e.target.value)}
                        defaultValue={monto}
                        value={monto}
                    />
                </div>

            <button onClick={onClick} className='p-3 rounded-sm bg-primary text-white'>finalizar</button>
    </form>
   </>
  )
}



export default IncompleteModal