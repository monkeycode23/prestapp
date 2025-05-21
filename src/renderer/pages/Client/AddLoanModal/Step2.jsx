import React,{ useState,useEffect } from "react";
import { useNotification } from "../../../components/Notifications";
import { useModal } from "../../../components/Modal";
import { useGuide } from "../../../components/GuidedForm/GuidedForm";




const Step2 = () => {
    const { formData, disableNext,errors, nextStep, handleChange, enableNext, registerOnNext, validate, setField } = useGuide()
  
  
  
    useEffect(() => {
  
      enableNext()
      // Registra el callback para este paso
      registerOnNext(async () => {
        ////console.log("Callback ejecutado desde Step1");
  
        const isValidate = await validate({
          installments: {
            required: {
              param: true,
              message: "Este campo es requerido para avanzar",
  
            },
            min: {  
              param: 0,
              message: "El numero de cuotas debe ser mayor a 0"
            }
          }
        })
        


        ////console.log("isValidate:----------------------------->",isValidate)
        if (isValidate) nextStep()
        else return 
  
      });
    }, [registerOnNext]);
    return (
      <div className="mb-4">
        <h3 className=" text-xl font-semibold p-3  pb-7 block text-black dark:text-white text-center ">
          En cuantas cuotas desea que se pague?
        </h3>
        <div className="relative">
          <input
  
              name="installments"
            type="number"
            placeholder="Ingresa tu nombre de usuario"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) => {
  
              setField({ type: "set", field: "installments", value: e.target.value })
  
              /*      const amount = formData.monto+(formData.monto*formData.interes)
                   
                   const cuotasAmount = Math.round(amount/formData.cuotas,2)
        */
              // (e)=>
              // setCuotasMonto(cuotasAmount)
  
            }}
            defaultValue={formData.installments.value}
            value={formData.installments.value}
          />
  
  
  
          <div className='flex  mt-5 mb-5 gap-2'>
            {
              [2, 3, 6, 10].map((p) => <span
  
                onClick={(e) => {
                  const cuotas = e.target.innerText;
                  setField({ type: "set", field: "installments", value: cuotas })
  
  
                  //console.log(formData)
                }}
                className='text-sm p-2  border border-stroke  text-center cursor-pointer rounded-lg'
              >
                {p}</span>)
            }
  
            <p className="text-center text-red ">
              {
                formData.installments.error ? formData.installments.error : ""
              }
            </p>
          </div>
        </div>
      </div>
    )
  }
  

  export default Step2;