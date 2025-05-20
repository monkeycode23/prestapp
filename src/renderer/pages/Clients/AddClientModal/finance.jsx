import React,{ useState,useEffect } from "react"
import { useGuide } from "../../../components/GuidedForm/GuidedForm"

function Step5() {

    const {formData,disableNext,nextStep,handleChange,enableNext,registerOnNext,validate,setField} = useGuide()
  
    const [isValid,setIsValid] = useState(true)
    
  
    useEffect(() => {
  
      enableNext()
      // Registra el callback para este paso
      registerOnNext(() => {
        console.log("Callback ejecutado desde Step1");
  
        const errors = validate({
           cbu:{
            required:{
              param:true,
              message:"Este campo es requerido para avanzar",
              
            },
            minLength:{
              param:3,
              message:"No puede ser menor a 3"
            },
            maxLength:{
              param:20,
              message:"No puede ser mayor a 15"
            }
           
          },
          alias:{
            
            required:{
              param:true,
              message:"Este campo es requerido para avanzar",
              
            },
            minLength:{
              param:3,
              message:"No puede ser menor a 3"
            },
            maxLength:{
              param:20,
              message:"No puede ser mayor a 15"
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
            Coloca el nombre y apellido del cliente 
          </label>
          <div className="relative">
  
            {/* nombre */}
            <input
              value={formData.name.value}
              onChange={(e)=>{
                setField({type:"set",field:"name",value:e.target.value})
  
                
              }}
              //onChange={(e)=>setField({type:"set",field:"password",value:e.target.value})}
              name="name"
              type="text"
              placeholder="ingrese el nombre del cliente"
              // defaultValue={fields.password.value}
              // value={fields.password.value}
              className={`w-full mb-3 rounded-lg border border-stroke ${formData.name.error
                ? 'border-red' : ''
  
              }  focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
  
            />
            <p className="text-center text-red ">
              {
                formData.name.error ? formData.name.error : ""
              }
            </p>
            {/* nombre */}
            <input
              value={formData.lastname.value}
              onChange={(e)=>{
                setField({type:"set",field:"lastname",value:e.target.value})
  
                
              }}
              //onChange={(e)=>setField({type:"set",field:"password",value:e.target.value})}
              name="lastname"
              type="text"
              placeholder="ingrese el apellido del cliente"
              // defaultValue={fields.password.value}
              // value={fields.password.value}
              className={`w-full rounded-lg border border-stroke ${formData.lastname.error
                ? 'border-red' : ''
  
              }  focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
  
            />
            <p className="text-center text-red ">
              {
                formData.lastname ? formData.lastname.error : ""
              }
            </p>
  
            {/**apellido */}
            
          </div>
  
  
  
        </div>
  
      </div>
    )
  }
  

  export default Step5