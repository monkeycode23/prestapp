import React,{ useState,useEffect } from "react";
import { useNotification } from "../../../components/Notifications";
import { useModal } from "../../../components/Modal";
import { useGuide } from "../../../components/GuidedForm/GuidedForm";

import SelectGroupOne from "../../../components/Forms/SelectGroup/SelectGroupOne";

const Step1 = () => {
    const { formData, disableNext, nextStep, handleChange,
      enableNext, registerOnNext, validate, setField } = useGuide()
  
  
    const montos = [10000, 20000, 50000, 100000]
    useEffect(() => {
  
      enableNext()
      // Registra el callback para este paso
      registerOnNext(async () => {
        //console.log("Callback ejecutado desde Step1");
  
        const errors = await validate({
          amount: {
            required: {
              
              message: "Este campo es requerido para avanzar",
              param:true

            },
            min: {
              message: "El monto debe ser mayor a 5000",
              param: 5000,
            },
  
          },
          interest_rate: {
            required: {
              
              message: "Este campo es requerido para avanzar",
              param:true
            },
            min: {
              message: "La tasa de interes debe ser mayor a 0",
              param: 0,
            },
          },
        })

        //console.log("errors:----------------------------->",errors)
        if(errors){
          nextStep()
        }else return 
  
        
  
      });
    }, [registerOnNext]);
  
    return (

     <div>
       <h2 className="text-xl font-semibold p-3  pb-7 block text-black dark:text-white text-center ">
        Cuanto dinero  deseas prestar?  a que tasa de interes</h2>
       <div className="flex ">
        
        <div className="mb-4">
        
        <div className="relative">
          <input
            step={1000}
            name="monto"
            type="number"
            min={5000}
            placeholder="Ingresa el monto del prestamo"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) => setField({ type: "set", field: "amount", value: e.target.value })}
            defaultValue={10000}
            value={formData.amount.value}
          />
  
  
  
          <div className='flex  mt-5 mb-5 gap-2'>
            {
              montos.map((e) => <span
  
                onClick={(e) => {
                  setField({ type: "set", field: "amount", value: Number(e.target.innerText) })
                }}
                className='text-sm p-2  border border-stroke  text-center cursor-pointer rounded-lg'
              >
                {e}</span>)
            }
          </div>
  
          <p className="text-center text-red ">
            {
              formData.amount.error ? formData.amount.error : ""
            }
          </p>
  
        </div>
      </div>
      <div className="mb-4">
        
        <div className="relative">
          <input
            
            name="monto"
            type="number"
            
            placeholder="tasa de interes"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) => setField({ type: "set", field: "interest_rate", value: e.target.value })}
            defaultValue={formData.interest_rate.value}
            value={formData.interest_rate.value}
          />
  
  
  
      
  
          <p className="text-center text-red ">
            {
              formData.interest_rate.error ? formData.interest_rate.error : ""
            }
          </p>
  
        </div>
      </div>

      </div>
     </div>
    )
  }
  

export default Step1;