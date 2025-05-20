import React,{ useState,useEffect } from "react"
import { useGuide } from "../../../components/GuidedForm/GuidedForm"

function Step1() {

    const {formData,disableNext,nextStep,handleChange,enableNext,registerOnNext,validate,setField} = useGuide()
  
   
    const [isValid,setIsValid] = useState(true)
    
  
    useEffect(() => {
  
      const init = async  ()=>{
  
        
      // const r =  await  window.sqlite.query(`SELECT id from clients WHERE nickname='${formData.nickname.value}'`)
            
  
        enableNext()
      // Registra el callback para este paso
      registerOnNext(async () => {
        console.log("Callback ejecutado desde Step1");
  
        const errors =await validate({
         
          nickname:{
            required:{
              param:true,
              message:"Este campo es requerido para avanzar",
              
            },
            minLength:{
              param:3,
              message:"No puede ser menor a 3"
            },
            maxLength:{
              param:30,
              message:"No puede ser mayor a 30"
            },
            /* custom:{
            param:true,
            message:"Ya existe un cliente con ese nombre",
            fn:async()=>{
              const r =  await  window.database.models.Clients.getClient({
                where:'nickname=?',
                params:[formData.nickname.value]
              })
              console.log("r:>>>",r)
              return r.length == 0 
            }
           }  */
  
         
          }
        })
  
    
        if(errors) {
          
          const client  =await window.database.models.Clients.getClient({
            where:'nickname=?',
            params:[formData.nickname.value]
          })
         

          if(client.length > 0) {
          
            setField({type:"error",field:"nickname",error:"Ya existe un cliente con ese nombre"})
          }else{
            nextStep()
          }

        }
       
      })
      }
  
      init()
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
            Coloca el nombre del cliente
          </label>
          <div className="relative">
            <input
              value={formData.nickname.value}
              onChange={(e)=>{
                setField({type:"set",field:"nickname",value:e.target.value})
              }}
              //onChange={(e)=>setField({type:"set",field:"password",value:e.target.value})}
              name="nickname"
              type="text"
              placeholder="ingrese el nombre del cliente"
              // defaultValue={fields.password.value}
              // value={fields.password.value}
              className={`w-full rounded-lg border border-stroke ${formData.nickname.error
                ? 'border-red' : ''
  
              }  focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
  
            />
            <p className="text-center text-red ">
              {
                formData.nickname.error ? formData.nickname.error : ""
              }
            </p>
           
          </div>
  
  
  
        </div>
  
      </div>
    )
  }
  

  export default Step1