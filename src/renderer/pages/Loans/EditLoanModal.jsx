import React,{useState,useEffect} from 'react'
import Modal, { useModal } from '../components/Modal'

import Select from '../components/Forms/SelectGroup/Select'


function EditLoanModal({loan,button}) {
 
  return (
    
    <Modal title={"Editar Prestamo"} button={button}>

       <EditLoanForm loan={loan}></EditLoanForm>
    </Modal>
  )
}



function  EditLoanForm({loan}){

    
    const {
        label,
        payment_interval:interval,
        interes_percentage:interes,
        amount,
        id,
        installments,
        status,
        aproved_date:date,

    } = loan;

   // console.log(id)
    
    const {loans,setLoans} = useClient()
  // console.log(payment)
 // console.log(loan)

    const {showNotification,setNotification} = useNotification()
    
    const {toggleModal} = useModal()
 
   const [formData,setFormData] = useState({
    id:{
        value:id,
        error:"",
    },
        amount:{
            value:amount,
            error:"",
        },

        installments:{
            value:installments,
            error:"",
        },

        interes:{
            value:interes,
            error:"",
        },
        date:{
            value:date,
            error:"",
        },
       
       
        label:{
            value:label,
            error:"",
        },
        interval:{
            value:interval,
            error:"",
        },
        status:{
            value:status,
            error:"",
        }
    }) 


 
    function setField({type,field,value}){
        
        if(type=="set"){
           // console.log(value)
            setFormData((prev)=>{
                return {
                    ...prev,
                    [field]:{
                       
                        ...formData[field],
                        value:value,
                    },
                    
                }
            })
           // console.log(formData[field])
        }

        if(type=="error"){
            setFormData((prev)=>{
                return {
                    ...prev,
                    [field]:{
                        
                        ...formData[field],
                        error:value,
                    },
                    
                }
            })
        }
       
    }


    return (
        <div>

            <form onSubmit={(e)=>e.preventDefault()}>

            <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                        Etiqueta 
                    </label>
                    <input
                        step={1000}
                        name="label"
                        type="text"
                        min={5000}
                        placeholder="Ingresa el monto del pago"
                        className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                        onChange={(e) => setField({ type: "set", field: "label", value: e.target.value })}
                        defaultValue={formData.label.value}
                        value={formData.label.value}
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                        Monto 
                    </label>
                    <input
                        step={1000}
                        name="monto"
                        type="number"
                        min={5000}
                        placeholder="Ingresa el monto del pago"
                        className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                        onChange={(e) => setField({ type: "set", field: "amount", value: e.target.value })}
                        defaultValue={formData.amount.value}
                        value={formData.amount.value}
                        formNoValidate
                    />
                </div>
                <div className='flex  '>
                
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                        Interes del prestamo
                    </label>
                    <input
                        
                        name="interes"
                        type="number"
                        
                        placeholder="Ingresa el monto del pago"
                        className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                        onChange={(e) => setField({ type: "set", field: "interes", value: e.target.value })}
                        defaultValue={formData.interes.value}
                        value={formData.interes.value}
                        formNoValidate
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                        N de Cuotas
                    </label>
                    <input
                        
                        name="installments"
                        type="number"                  
                        placeholder="Ingresa el monto del pago"
                        className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                        onChange={(e) => setField({ type: "set", field: "installments", value: e.target.value })}
                        defaultValue={formData.installments.value}
                        value={formData.installments.value}
                        formNoValidate
                    />
                </div>
                </div>

                <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                        Fecha de entrega Prestamo
                    </label>
                <input
            
                    name="date"
                    type="date"
                    placeholder="fecha del pago"
                    className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    onChange={(e)=> setField({type:"set",field:"date",value:e.target.value})}
                    defaultValue={formData.date.value }
                    value={formData.date.value} />
            </div>

            <div className='flex '>
                <div className='w-1/2'>
                <Select  label={"Estado del prestamo"} onChange={(e)=>setField({type:"set",field:"status",value:e.target.value})} 
            options={[
                {
                    label:"Completado",
                    value:"cmpleted",
                    selected:status=="payed"
                },
                {
                    label:"Cancelado",
                    value:"canceled",
                    selected:status=="expired"
                },
                {
                    label:"Activo",
                    value:"active",
                    selected:status=="pending"
                },
            ]}>
           
            
         
            </Select>
                </div>
            <div className='w-1/2'>
            <Select  label={"Periodo de pagos"} onChange={(e)=>setField({type:"set",field:"interval",value:e.target.value})} 
            options={[
                {
                    label:"diario",
                    value:"daily",
                    selected:status=="daily"
                },
                {
                    label:"semanal",
                    value:"weekly",
                    selected:status=="weekly"
                },
                {
                    label:"mensual",
                    value:"monthly",
                    selected:status=="monthly"
                },
            ]}>
           
            
         
            </Select>
            </div>
            </div>


            <button
                onClick={()=>{

                    //console.log(formData)
                    
                    //console.log(loan)
                     loansModel.updateLoan({
                            id:formData.id.value,
                            amount:formData.amount.value,
                            status:formData.status.value,
                            installments:formData.installments.value,
                            interval:formData.interval.value,
                            date:formData.date.value,
                            label:formData.label.value,
                            interes:formData.interes.value,
                            
                        },loan) 
                        
                /*    paymentsModel.insertPayments({
                            
                            amount:formData.amount.value,
                            state:formData.state.value,
                            installments:formData.installments.value,
                            paymentInterval:formData.interval.value,
                            date:formData.date.value,
                            label:formData.label.value,
                            interes:formData.interes.value,
                            loanId:id
                            
                    }) */
                       //  toggleModal();

                        setNotification({
                            type:"success",
                            message:"Prestamo actualizado con exito"
                        })

                        showNotification()
                       
                        if(loans!=null){
                            setLoans((prev)=>prev.map((p)=>p.id==loan.id ? {
                                ...p,
                                amount:formData.amount.value,
                                status:formData.status.value,
                                installments:formData.installments.value,
                                payment_interval:formData.interval.value,
                                aproved_date:formData.date.value,
                                label:formData.label.value,
                                interes_percentage:formData.interes.value,
                            } : p))
                        }
                       

                         
                       
                    }
            }
            className='p-3 bg-primary text-white'>
                editar
            </button>
            </form> 
        </div>
    )
}

import { useNotification } from '../../../../components/Notifications'
import paymentsModel from '../../../../database/models/Payments'

/*

function Amount() {
    
  return (
    <div className="mb-4">
    <h3 className=" text-xl font-semibold p-3  pb-7 block text-black dark:text-white text-center ">
        Cunato dinero  deseas prestar?
    </h3>
    <div className="relative">
        <input
            step={1000}
            name="monto"
            type="number"
            min={5000}
            placeholder="Ingresa el monto del prestamo"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={ (e)=>setField({type:"set",field:"monto",value:e.target.value})}
            defaultValue={10000}
            value={formData.monto.value}
        />

        <div className='flex  mt-5 mb-5 gap-2'>
            {
                montos.map((e) => <span

                    onClick={(e) => {
                       setField({type:"set",field:"monto",value:Number(e.target.innerText)})  
                    }}
                    className='text-sm p-2  border border-stroke  text-center cursor-pointer rounded-lg'
                >
                    {e}</span>)
            }
        </div>

        <p className="text-center text-red ">
    {
      formData.monto.error ? formData.monto.error : ""
    }
  </p>

    </div>
</div>
  )
}
 */

export default EditLoanModal