
import React,{useState,useEffect} from 'react'
import Modal,{ useModal } from '../../components/Modal'
import { useNotification } from '../../components/Notifications'
import { setClient,updateClient } from '../../redux/reducers/clients'
import {setContactInformation,setFinancialInformation,setBasicInformation, } from '../../redux/reducers/information'

import { useSelector,useDispatch } from 'react-redux'


import Tabs from '../../components/Tabs'






function EditModalClient({button}) {
  // console.log(payment)
  
  return (
    
    <Modal buttonLabel={"edit"} title={"Editar Cliente"} button={button}>

        <EditClientForm  ></EditClientForm >
    </Modal>
  )
}


function  EditClientForm({payment,button}){

    const client = useSelector((state)=>state.clients.client)
    const dispatch = useDispatch()
    const {setNotification,showNotification} = useNotification()
    const {toggleModal} = useModal()
    const information = useSelector((state)=>state.information)
  // console.log(payment)

    const [formData,setFormData] = useState({
        nickname:{
            value:client.nickname,
            error:"",
        },
        name:{
            value:information.basicInformation.name,
            error:"",
        },
        lastname:{
            value:information.basicInformation.lastname,
            error:"",
        },
        email:{
            value:information.contactInformation.email,
            error:"",
        },
        phonenumber:{
            value:information.contactInformation.phonenumber,
            error:"",
        },
        cbu:{
            value:information.financialInformation.cbu,
            error:"",
        },
        alias:{
            value:information.financialInformation.alias,
            error:"",
        }
    })


    useEffect(() => {
      
        
      return () => {
        
      }
    }, [formData])
    

    function setField({type,field,value}){
        
        if(type=="set"){
            console.log(value)
            setFormData((prev)=>{
                return {
                    ...prev,
                    [field]:{
                       
                        ...formData[field],
                        value:value,
                    },
                    
                }
            })
            console.log(formData[field])
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

                <Tabs tabs={[
                    {
                        name:"info basica",
                        content:(<BasicInforation  formData={formData} setField={setField}/>)
                    },
                    {
                        name:"info contacto",
                        content:(<ContactInformation formData={formData} setField={setField}/>)
                    },
                    {
                        name:"billetera vitual",
                        content:(<VirtualWallet formData={formData} setField={setField}/>)
                    },
                    
                ]}></Tabs>
           <div className='flex justify-end'>
           <button
            onClick={async(e)=>{
    

                await window.database.models.Clients.updateClient({
                    id:client.id,
                    nickname:formData.nickname.value,
                    
                })

                const info = await window.database.models.Information.getInformation({
                    where:`client_id = '${client.id}'`
                })

                console.log("info-------------->",info)

                if(info.length>0){
                    await window.database.models.Information.updateInformationFilter({
                    where:`client_id = '${client.id}'`,
                    data:{
                        name:formData.name.value,
                        lastname:formData.lastname.value,
                        email:formData.email.value,
                        phone:formData.phonenumber.value,
                        alias:formData.alias.value,
                        cbu:formData.cbu.value
                    }

                    })
                }else{
                    await window.database.models.Information.createInformation({
                        client_id:client.id,
                        name:formData.name.value,
                        lastname:formData.lastname.value,
                        email:formData.email.value,
                        phone:formData.phonenumber.value,
                        alias:formData.alias.value,
                        cbu:formData.cbu.value
                    })
                }
                    
                dispatch(updateClient({
                    ...client,
                    nickname:formData.nickname.value,
                }))
                dispatch(setBasicInformation({
                    name:formData.name.value,
                    lastname:formData.lastname.value,
                }))
                dispatch(setContactInformation({
                    email:formData.email.value,
                    phonenumber:formData.phonenumber.value,
                }))
                dispatch(setFinancialInformation({
                    alias:formData.alias.value,
                    cbu:formData.cbu.value
                }))

                
              /**
               *TODO: agregar llamada api para editar un cliente
               */
                    toggleModal()
                    
                    setNotification({
                        type:"success",
                        message:"Cliente actualizado con exito"
                    })
                    showNotification()
                   // console.log(payment)
                   /*  setClient({
                        ...client,
                        nickname:formData.nickname.value,
                        name:formData.name.value,
                        lastname:formData.lastname.value,
                        email:formData.email.value,
                        phonenumber:formData.phonenumber.value,
                        alias:formData.alias.value,
                        cbu:formData.cbu.value,
                    }) */
                    
                }
            }
            className='p-3 bg-primary text-white'>
                editar
            </button>
           </div>
            </form>
        </div>
    )
}



export default EditModalClient




const BasicInforation = ({formData,setField}) => {
    return (
        <>
        <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                        Nickname (apodo)
                    </label>
                    <input
                        step={1000}
                        name="label"
                        type="text"
                        min={5000}
                        placeholder="Ingresa el monto del pago"
                        className={`w-full rounded-lg border border-stroke  bg-transparent py-4 pl-6 pr-10  focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                        onChange={(e) => setField({ type: "set", field: "nickname", value: e.target.value })}
                        defaultValue={formData.nickname.value}
                        value={formData.nickname.value}
                    />
                </div>
                <div className="mb-4">
                    <div className='flex'>
                        <div>
                            <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                                Nombre
                            </label>
                            <input
                                step={1000}
                                name="label"
                                type="text"
                                min={5000}
                                placeholder="Ingresa el monto del pago"
                                className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                                onChange={(e) => setField({ type: "set", field: "name", value: e.target.value })}
                                defaultValue={formData.name.value}
                                value={formData.name.value}
                            />
                        </div>
                        <div>
                            <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                                Apellido
                            </label>
                            <input
                                step={1000}
                                name="label"
                                type="text"
                                min={5000}
                                placeholder="Ingresa el monto del pago"
                                className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                                onChange={(e) => setField({ type: "set", field: "lastname", value: e.target.value })}
                                defaultValue={formData.lastname.value}
                                value={formData.lastname.value}
                            />
                        </div>

                    </div>
                </div>


        </>
    )
}

const ContactInformation = ({formData,setField}) => {
    return (
       <>
       
       <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                        Email
                    </label>
                    <input

                        name="date"
                        type="email"
                        placeholder="email del cliente"
                        className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                        onChange={(e) => setField({ type: "set", field: "email", value: e.target.value })}
                        defaultValue={formData.email.value}
                        value={formData.email.value} />
                </div>

                <div className='mb-4'>
                    <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                        Numero de telefono
                    </label>
                    <input
                        step={1000}
                        name="label"
                        type="text"
                        min={5000}
                        placeholder="Ingresa el numero de telefono del cliente"
                        className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                        onChange={(e) => setField({ type: "set", field: "phonenumber", value: e.target.value })}
                        defaultValue={formData.phonenumber.value}
                        value={formData.phonenumber.value}
                    />
                </div>


       </>
    )
}

const VirtualWallet = ({formData,setField}) => {
    return (
       <>
        <div className="mb-4">
                    <div className='flex'>
                        <div className='w-2/4'>
                            <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                                Alias
                            </label>
                            <input
                                step={1000}
                                name="label"
                                type="text"
                                min={5000}
                                placeholder="Ingresa el alias del pago"
                                className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                                onChange={(e) => setField({ type: "set", field: "alias", value: e.target.value })}
                                defaultValue={formData.alias.value}
                                value={formData.alias.value}
                            />
                        </div>
                        <div className='w-3/4'>
                            <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                                Cbu
                            </label>
                            <input
                                step={1000}
                                name="label"
                                type="text"
                                min={5000}
                                placeholder="Ingresa el cbu del pago"
                                className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                                onChange={(e) => setField({ type: "set", field: "cbu", value: e.target.value })}
                                defaultValue={formData.cbu.value}
                                value={formData.cbu.value}
                            />
                        </div>

                    </div>
                </div>
       </>
    )
}

/* 

               

*/