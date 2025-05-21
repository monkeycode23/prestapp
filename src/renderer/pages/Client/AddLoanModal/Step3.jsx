import React,{ useState,useEffect } from "react";
import { useNotification } from "../../../components/Notifications";
import { useModal } from "../../../components/Modal";
import { useGuide } from "../../../components/GuidedForm/GuidedForm";

import SelectGroupOne from "../../../components/Forms/SelectGroup/SelectGroupOne";


const Step3 = () => {
    const { formData, disableNext, nextStep, handleChange, enableNext, registerOnNext, validate, setField } = useGuide()
    useEffect(() => {
  
      enableNext()
      // Registra el callback para este paso
      registerOnNext(async () => {
        ////console.log("Callback ejecutado desde Step1");
  
        const errors = await validate({
          loan_date: {
            required: {
              param: true,
              message: "Este campo es requerido para avanzar",
  
            },
            date: {
              param: true,
              message: "Debe ser una fecha valida",
            },
  
          }
        })
  
  
        if (errors) nextStep()
        else return
  
      });
    }, [registerOnNext]);
    return (
      <div className="mb-4">
        <h3 className=" text-xl font-semibold p-3  pb-7 block text-black dark:text-white text-center ">
          Elija la fecha de  entrega del prestamo
        </h3>
        <div className="relative">
          <input
  
              name="loan_date"
            type="date"
            placeholder="Ingresa tu nombre de usuario"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) => setField({ type: "set", field: "loan_date", value: e.target.value })
            }
            defaultValue={formData.loan_date.value}
            value={formData.loan_date.value}
          />
  
  
          <p className="text-center text-red ">
            {
              formData.loan_date.error ? formData.loan_date.error : ""
            }
          </p>
  
        </div>
      </div>
    )
  }
  

  export default Step3;