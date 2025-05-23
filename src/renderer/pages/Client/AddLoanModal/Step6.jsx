import React,{ useState,useEffect } from "react";
import { useNotification } from "../../../components/Notifications";
import { useModal } from "../../../components/Modal";
import { useGuide } from "../../../components/GuidedForm/GuidedForm";
import { setDebt } from "../../../redux/reducers/clients";
import SelectGroupOne from "../../../components/Forms/SelectGroup/SelectGroupOne";

import { useSelector,useDispatch } from "react-redux";
import { createPayments } from "../funcs";
import { setLoans,addLoan, setTotalLoans,setLeftToPaid } from "../../../redux/reducers/loans";
import {setPaymentsCount} from "../../../redux/reducers/payments"
const Step6 = () => {

    const { formData, disableNext, nextStep, handleChange, enableNext, registerOnNext, registerOnBack, validate, setField,goToStep } = useGuide()
    const client = useSelector((state) => state.clients.client)
    const {id} = client
    const dispatch = useDispatch()
    const {showModal,toggleModal} = useModal()
    const {setNotification,showNotification} = useNotification()
    const totalLoans = useSelector((state) => state.loans.totalLoans)
    const paymentsCount = useSelector((state) => state.payments.paymentsCount)
    const leftToPaid = useSelector((state) => state.loans)
    const debt = useSelector((state) => state.clients.debt)
    
    useEffect(() => {
  
      enableNext()

      registerOnBack(()=>{
        //console.log("Callback ejecutado desde Step1");
        goToStep(4)
      })
      // Registra el callback para este paso
      registerOnNext(async() => {
        //console.log("Callback ejecutado desde Step1");
  
        const errors = validate({
          generated_payments_date: {
            required: {
              param: true,
              message: "Este campo es requerido para avanzar",
  
            },
  
          }
        })
  
  
        if (errors) {
            ////console.log("formData:----------------------------->", formData)
            const gains = Math.floor(Number(formData.amount.value) * Number(formData.interest_rate.value) / 100)
            const labelNumber = Number(totalLoans)

            const loan = await insertLoan({
                amount: formData.amount.value,
                label:"prestamo n° "+(labelNumber+1),
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

              const payments = await createPayments(loan,formData.sunday.value)
              //console.log("payments:----------------------------->",payments)
              //console.log("loan:----------------------------->",loan)
              dispatch(addLoan(loan))
              dispatch(setTotalLoans(totalLoans+1))

              dispatch(setDebt(debt+(formData.amount.value+gains)))

              // //console.log(insert)
             /*  */
    
          /*      */
          dispatch(setPaymentsCount({
            ...paymentsCount,
            pending:formData.installments.value,
          }))
          toggleModal();
    
              setNotification({
                type: "success",
                message: "Prestamo agregado con exito"
              })
    
              showNotification()
        }
  
      });
    }, [registerOnNext]);
    return (
      <div className="mb-4">
        <h3 className=" text-xl font-semibold p-3  pb-7 block text-black dark:text-white text-center ">
          Especifique las fechas del primer pago
        </h3>
        <div className="relative">
          <input
  
            name="fecha"
            type="date"
            placeholder="Ingresa tu nombre de usuario"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) => setField({ type: "set", field: "generated_payments_date", value: e.target.value })
            }
            defaultValue={formData.generated_payments_date.value}
            value={formData.generated_payments_date.value}
          />
  
  
          <p className="text-center text-red ">
            {
              formData.generated_payments_date.error ? formData.generated_payments_date.error : ""
            }
          </p>
  
        </div>
      </div>
    )
  }
  

  import { insertLoan } from "../funcs";

  export default Step6;