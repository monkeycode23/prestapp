import React, { useState, useEffect } from "react";

//components
import { Link } from "react-router-dom";
import EditModalPayment from "./EditModalPayment";
import DropdownDefault from "../../components/Dropdowns/DropdownDefault";
import PaymentModal from "./PaymentModal";
import { DeleteIcon, Eye, MoneyBillAlt, NoteIcon, PaymentIcon, NotesIcon } from "../../components/Icons";


//hooks
import { useNotification } from "../../components/Notifications";
import { useSelector   } from "react-redux";
import { deletePayment } from "../../redux/reducers/payments";
import { useDispatch } from "react-redux";

//funcions
import { setLoan } from "../../redux/reducers/loans";
import { getNotes,payPayment } from "./funcs"
import { setBruteGains,setNetGains,updatePayment } from "../../redux/reducers/payments"
import { formatDateDifference, excludeProperties } from "../../common/funcs";
//import { setNotes } from "../../redux/reducers/notes"


export const PaymentsList = ({  }) => {

  //console.log(clients)
  const payments = useSelector(state=>state.payments.payments)

  console.log("payments--asdasdasdasdasd-a>>",payments)


  return (
    <>
      {
        payments.length > 0 ? (
          
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ">
      {payments.map((payment) => {

        //  console.log(payment)
        return (
          <PaymentCard
            key={payment.id}

            payment={payment}
          //profileImage={user.profileImage}
          />
        )
      })}
    </div>
        ) : 
        (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-2xl font-bold">No hay pagos</p>
          </div>
        )
      }
    </>
  );
};


export const PaymentCard = ({ payment }) => {


  //console.log(payment)
  const { setNotification, showNotification } = useNotification()
  const { amount, payment_date: date, id, label, status,paid_date } = payment
  const dispatch = useDispatch()
  const loan = useSelector(state=>state.loans.loan)
  const bruteGains = useSelector(state=>state.payments.bruteGains)
  const netGains = useSelector(state=>state.payments.netGains)
  //const notes = useSelector(state=>state.notes.notes)
  const [notes,setNotes] = useState('')

  function stateLabel(status) {
    if (status == "paid") return "Pagado"
    else if (status == "expired") return "Vencido"
    else if (status == "pending") return "Pendiente"
    else if (status == "incomplete") return "Incompleto"
  }

  useEffect(()=>{
    
    async function init(){

      const _nootes = await window.database.models.Notes.getNote({
        where:`payment_id = ${payment.id}`
      })

     // setNotes(_nootes[0].notes)
      //dispatch(setNotes(_nootes[0].notes))
    }
    init()
  },[payment])


  const pay=async (e) => {

    const  isCompleted = await payPayment(id,loan)

    console.log("isCompleted--a>>",isCompleted)

    dispatch(updatePayment({
      id:payment.id,
      payment:{
        ...payment,
        status:"paid"
      }
    }))

    dispatch(setBruteGains(bruteGains + payment.gain))
    dispatch(setNetGains(netGains + payment.amount))


    if(isCompleted){

      dispatch(setLoan({
        ...loan,
        status:"completed"
      }))

     

    

    }
    

   /*  setPayed((prev) => prev + 1)

    setGains((prev) => prev + payment.gains)
    setNetGains((prev) => prev + payment.net_amount)

    setNotification({
      type: "success",
      message: "Pagodo con exito"
    })
    showNotification()


    updatePayments((prev) => {
      return prev.map((p) => p.id == id ? {
        ...p,
        status: "paid"
      } : p)
    }) */
    /* await deletePayment(payment.id)
     await deleteLoan(id) 
     

      
       */
  }

  const handlePayInterest = () => {
    const interest = amount * 0.3; // 30% del monto del pago
    console.log(`Pago de interés: $${interest}`);
    // Aquí puedes agregar la lógica para procesar el pago del interés
  };

  return (
    <div className="col-span-1 max-w-sm  bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      {/* Header */}

      <DropdownDefault >

        {/* agregar nota button */}
        <AddNoteModalPayment payment={payment}
          button={<button
            onClick={async ()=>{

              /* const _note = await window.database.models.Notes.getNote({
                where:`payment_id = ${payment.id}`
              })
              dispatch(setNotes(_note[0].notes))

              console.log("payment---a>>",payment) */
            }}
            className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4">
            <NoteIcon payment={payment} />
            agregar nota
          </button>}
        ></AddNoteModalPayment>


        {/*  ver pago button  */}
        <PaymentModal payment={payment}
          button={<button

            className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4">
            <Eye></Eye>
            ver pago
          </button>}
        ></PaymentModal>
        
        {/* pay button */}
        <button disabled={status == "paid"}
          onClick={pay}
          className={`flex w-full items-center gap-2 ${status == "paid" ? "opacity-30" : ""} rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4 `}>
          <MoneyBillAlt></MoneyBillAlt>
          Pagarr
        </button>
        <button
          onClick={handlePayInterest}
          className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4"
        >
          <MoneyBillAlt />
          Pagar Recargo
        </button>

        {/* editar pago */}
        <EditModalPayment payment={payment}
          button={(<button
            className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4">
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_62_9787)">
                <path
                  d="M15.55 2.97499C15.55 2.77499 15.475 2.57499 15.325 2.42499C15.025 2.12499 14.725 1.82499 14.45 1.52499C14.175 1.24999 13.925 0.974987 13.65 0.724987C13.525 0.574987 13.375 0.474986 13.175 0.449986C12.95 0.424986 12.75 0.474986 12.575 0.624987L10.875 2.32499H2.02495C1.17495 2.32499 0.449951 3.02499 0.449951 3.89999V14C0.449951 14.85 1.14995 15.575 2.02495 15.575H12.15C13 15.575 13.725 14.875 13.725 14V5.12499L15.35 3.49999C15.475 3.34999 15.55 3.17499 15.55 2.97499ZM8.19995 8.99999C8.17495 9.02499 8.17495 9.02499 8.14995 9.02499L6.34995 9.62499L6.94995 7.82499C6.94995 7.79999 6.97495 7.79999 6.97495 7.77499L11.475 3.27499L12.725 4.49999L8.19995 8.99999ZM12.575 14C12.575 14.25 12.375 14.45 12.125 14.45H2.02495C1.77495 14.45 1.57495 14.25 1.57495 14V3.87499C1.57495 3.62499 1.77495 3.42499 2.02495 3.42499H9.72495L6.17495 6.99999C6.04995 7.12499 5.92495 7.29999 5.87495 7.49999L4.94995 10.3C4.87495 10.5 4.92495 10.675 5.02495 10.85C5.09995 10.95 5.24995 11.1 5.52495 11.1H5.62495L8.49995 10.15C8.67495 10.1 8.84995 9.97499 8.97495 9.84999L12.575 6.24999V14ZM13.5 3.72499L12.25 2.49999L13.025 1.72499C13.225 1.92499 14.05 2.74999 14.25 2.97499L13.5 3.72499Z"
                  fill=""
                />
              </g>
              <defs>
                <clipPath id="clip0_62_9787">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Editar pago
          </button>)}
        >
        </EditModalPayment>

         <button 
                 onClick={async()=>{
                  /* 
                  await window.database.models.Payments.deletePayment(id)                  
                   setNotification({
                     type:"success",
                     message:"Pagon eliminado con exito"
                   }) */
                   showNotification()

                   dispatch(deletePayment(id))

                  // const loanWithoutNickname = excludeProperties(loan,["nickname"])
                   dispatch(setLoan({
                    ...loan,
                      installment_number:loan.installment_number-1
                   }))

                  console.log("loan---a>>",loan)
                  await window.database.models.Loans.updateLoan({
                      id:loan.id,
                      installment_number:loan.installment_number-1

                    }
                   )

                  // await window.sqlite.query("UPDATE loans SET installments=")
                   /* setLoan((prev)=>{                   
                    return {
                      ...prev,
                      installments:prev.installments-1
                    }
                   })

                   await window.sqlite.query(`UPDATE loans SET installments='${(loan.installments-1)}' WHERE id='${loanId}'`)

                   updatePayments(payments.filter((e)=>{
                    if(e.id!=id) return e 
                   })) */
                 }}
                 className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4">
                   <DeleteIcon></DeleteIcon>
                   Borrar pago
                 </button> 
      </DropdownDefault>

      <div className="flex justify-center flex-col  items-center">
        {/* Client Icon */}
        <div className="bg-lime-500 text-white w-15 h-15 flex flex-row justify-center items-center rounded-full">
          <PaymentIcon />
        </div>
        {/* Client Info */}
        <h3>{label}</h3>
        <span className='text-success font-bold text-2xl '>$ {Intl.NumberFormat('de-DE').format(amount)} </span>
        <p>fecha <span title={date} className="text-black text-sm font-bold"> {formatDateDifference(date)}</span></p>

      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-200"></div>

      {/* Rating Section 
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Rating:</p>
          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <StarIcon key={i} filled={i < rating} />
              ))}
          </div>
        </div>*/}

      {/* Action Button */}
      <div className="">


        <StateTag state={status}></StateTag>

        {
          paid_date && paid_date != "NULL" ? 
          
          new Date(paid_date)< new Date(date) ? (<Tag type={"success2"}  title={`Pagada el (${paid_date})  adelantado a la fecha de pago`} label={"P. adelan.."}></Tag>)
          : new Date(paid_date)> new Date(date) ? (<Tag title={"Pagada el ("+paid_date+") Fuera de fecha de pago"} type={"danger2"} label={"P. Atras.."}></Tag>) : (<Tag title="Pagada dentro de la fecha de pago" type={"success3"} label={"P. en fecha"}></Tag>)
          :(<></>)
        }

        {/* {state=="expired"? payed_date!=null ?  (): ""} */}
             {/*  {
                notes.length ? (  <Tag  type="primary" label={"Notas"} icon={<NotesIcon width={8} height={8}></NotesIcon>}></Tag>) : (<></>)
              } */}
        {/*  <Link to={"/prestamos/"+id}>ver prestamo</Link> */}
      </div>
    </div>
  );
};


import Tag from "../../components/Tag";
import AddNoteModalPayment from "./AddNoteModal";

export function StateTag({ state }) {

  let type
  if (state == "pending") type = "primary"
  if (state == "incomplete") type = "warning"
  if (state == "expired") type = "danger"
  if (state == "paid") type = "success"

  let label
  if (state == "pending") label = "pendiente"
  if (state == "incomplete") label = "incompleto"
  if (state == "expired") label = "vencido"
  if (state == "paid") label = "pagado"

  return (

    <Tag label={label}

      type={type}> </Tag>
  )
}


