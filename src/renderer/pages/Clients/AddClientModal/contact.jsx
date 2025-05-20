import React,{ useState,useEffect } from "react"
import { useGuide } from "../../../components/GuidedForm/GuidedForm"


function Step4() {

    const {formData,disableNext,nextStep,handleChange,enableNext,registerOnNext,validate,setField} = useGuide()
  
    const [isValid,setIsValid] = useState(true)
    
  
    useEffect(() => {
  
      enableNext()
      // Registra el callback para este paso
      registerOnNext(() => {
        console.log("Callback ejecutado desde Step1");
  
        const errors = validate({
           email:{
            required:{
              param:true,
              message:"Este campo es requerido para avanzar",
              
            },
            minLength:{
              param:3,
              message:"No puede ser menor a 3"
            },
            maxLength:{
              param:50,
              message:"No puede ser mayor a 50"
            },
            email:{
              param:true,
              message:"Debe ser un formato de email valido"
            }
           
          },
          phonenumber:{
            
            required:{
              param:true,
              message:"Este campo es requerido para avanzar",
              
            },
            phonenumber:{
              param:true,
              message:"Formato de numero invalido  ejempplo(0000-000000)",
            }
           
          }
        })
  
  
        if(errors) nextStep()
       
      });
    }, [registerOnNext]);
  
    useEffect(() => {
      
      //disableNext()
      return () => {
       
      }
    }, [])
    
    return (
      <div className="">
        <div className="mb-6">
          <label className="mb-2.5 block text-center mb-3 text-lg text-black dark:text-white">
            Completa la Informacion e contacto  
          </label>
          <div className="relative">
  
            {/* nombre */}
            <input
              value={formData.email.value}
              onChange={(e)=>{
                setField({type:"set",field:"email",value:e.target.value})
  
                
              }}
              //onChange={(e)=>setField({type:"set",field:"password",value:e.target.value})}
              name="email"
              type="email"
              placeholder="ingrese el email "
              // defaultValue={fields.password.value}
              // value={fields.password.value}
              className={`w-full mb-3 rounded-lg border border-stroke ${formData.email.error
                ? 'border-red' : ''
  
              }  focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
  
            />
            <p className="text-center text-red ">
              {
                formData.email.error ? formData.email.error : ""
              }
            </p>
            {/* nombre */}
            <input
              value={formData.phonenumber.value}
              onChange={(e)=>{
                setField({type:"set",field:"phonenumber",value:e.target.value})
  
                
              }}
              //onChange={(e)=>setField({type:"set",field:"password",value:e.target.value})}
              name="phonenumber"
              type="text"
              placeholder="ingrese el apellido del cliente"
              // defaultValue={fields.password.value}
              // value={fields.password.value}
              className={`w-full rounded-lg border border-stroke ${formData.phonenumber.error
                ? 'border-red' : ''
  
              }  focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
  
            />
            <p className="text-center text-red ">
              {
                formData.phonenumber ? formData.phonenumber.error : ""
              }
            </p>
  
            {/**apellido */}
            
          </div>
  
  
  
        </div>
  
      </div>
    )
  }
  

  export default Step4