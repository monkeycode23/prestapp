import React,{ useState,useEffect } from "react";
import { useNotification } from "../../../components/Notifications";
import { useModal } from "../../../components/Modal";
import { useGuide } from "../../../components/GuidedForm/GuidedForm";
import { createPayments,insertLoan } from "../funcs";
import { useDispatch,useSelector } from "react-redux";
import { addLoan, setLeftToPaid } from "../../../redux/reducers/loans";
import {setPaymentsCount} from "../../../redux/reducers/payments"
import { setDebt, setTotalLendMoney } from "../../../redux/reducers/clients";


const Step5 = ({ setLoans }) => {
    const [notifications, setNotifications] = useState([]);
   const { setNotification, showNotification } = useNotification()
   const { toggleModal } = useModal()
   const { formData, disableNext, nextStep, handleChange, enableNext, registerOnNext, validate, setField } = useGuide()
   const dispatch = useDispatch()
   const client = useSelector((state) => state.clients.client)
   const clients = useSelector((state) => state.clients)

   const {id} = client
   const paymentsCount = useSelector((state) => state.payments.paymentsCount)
   const installments = new Array(Number(formData.installments.value)).fill(0);
   const [pDates, setPDates] = useState(installments.map((e, i) => new Date()))
 // const leftToPaid  = useSelector((state) => state.loans)
  const debt = useState(state=>state.clients.debt)  
 //console.log(formData.installments.value)
   
   useEffect(() => {
 
     enableNext()
     // Registra el callback para este paso
     registerOnNext(async () => {
     // //console.log("Callback ejecutado desde Step5");
 
       const errors = validate({
          payment_interval: {
           required: {
             param: true,
             message: "Este campo es requerido para avanzar",
 
           },
 
         }
       })
 
      //console.log("errrrrrrrrrrrrrrrrooorss=====>",errors)
      
      if(errors) {
 
        //console.log("formData:----------------------------->", formData)
        const gains = Math.floor(Number(formData.amount.value) * Number(formData.interest_rate.value) / 100)

         const loan = await insertLoan({
            amount: formData.amount.value,
            label:"label prestamo",
            gain: gains,
            status:"active",
            installment_number: formData.installments.value,
            total_amount: Number(formData.amount.value) + Number(gains),
            loan_date: formData.loan_date.value,
            interest_rate: formData.interest_rate.value,
            payment_interval: formData.payment_interval.value,
            generate_payments_date: formData.generated_payments_date.value,
            client_id: id
          }) 

          //console.log("pDates:----------------------------->",pDates)

          const payments = await createPayments({
            ...loan,
            dates:pDates
          },formData.sunday.value)
 
          //console.log("loan:----------------------------->",loan)
          dispatch(addLoan(loan))
          //console.log("payments:----------------------------->",payments)
          dispatch(setPaymentsCount({
            ...paymentsCount,
            pending:formData.installments.value,
          }))


          dispatch(setDebt(debt+(formData.amount.value+gains)))
          dispatch(setTotalLendMoney(clients.totalLendMoney+loan.amount))
          
          /*  */

      /*      */
      toggleModal();

          setNotification({
            type: "success",
            message: "Prestamo agregado con exito"
          })

          showNotification()
 
 
       }
 
     });
   }, [registerOnNext,pDates]); 
 
   return (
 
   <div className="mb-4 h-80 overflow-auto">
 
       <h3 className=" text-xl font-semibold p-3  pb-7 block text-black dark:text-white text-center ">
         Elige las fechas de los pagos
       </h3>
       <div className="relative">
 
         {
              installments.map((e, i) => {
             return (<div key={i} className="mb-4">
               <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                 Pago numero {i + 1}
               </label>
               <input
                 name={"date"+i}
                 type="date"
                 placeholder={"fecha del pago " + i + 1}
                 className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                 onChange={(el) =>{
 
                   setPDates((prev) =>prev.map((e, j) =>j == i ? el.target.value : e))
 
                   //console.log(pDates)
                 } }
                 defaultValue={pDates[i]}
                 value={pDates[i]} />
             </div>)
           })
         }
 
 
       </div>
 
 
 
     </div>
 
 
   )
 }


 export default Step5;