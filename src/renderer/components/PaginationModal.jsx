import React, { useState } from 'react'

//components
import Modal from './Modal'
import { PaginationIcon } from './Icons'

//redux
import { useSelector, useDispatch } from 'react-redux'
import { setLimit } from '../redux/reducers/_pagination'

//hooks
import useLocalStorage from '../hooks/useLocalStorage'
import { useNotification } from '../components/Notifications'
import {useModal} from '../components/Modal'


const PaginationModal = () => {

  


/*   useEffect(() => {
    console.log(limit)
    setFormData({
      limit: {value: limit, error: "", isValid: true},
    })
  }, [limit]) */

  return (
        <Modal title={"Paginación"} button={
          <button className='bg-primary text-white px-3 py-1 rounded-full hover:bg-primary/80'>
            <PaginationIcon />
          </button>
        } >
          <PaginationModalForm />
        </Modal>
  )
}




const PaginationModalForm = () => {

  const {showNotification,setNotification} = useNotification()
  const {toggleModal} = useModal()
  const [storedValue,setStoredValue,deleteValue,updateValue] = useLocalStorage("pagination")
  const dispatch = useDispatch()

  const pagination = useSelector((state) => state.pagination)

  const limit = 
  pagination.label == "clients" ? 
  pagination.limit.clients.limit :
  
  pagination.label == "loans" ?
  pagination.limit.loans.limit :
  
  pagination.label == "payments" ?
  
  pagination.limit.payments.limit: 15


  const [formData, setFormData] = useState({
    limit: {value: limit, error: "", isValid: true},
  })
  return (
   <>
     
     <form>
           <div className="mb-6 flex justify-between items-center">
          <label className=" block text-center mb-3 text-lg text-black dark:text-white">
            Resultados por pagina:
          </label>
          <div className="relative">
            <input
            
                defaultValue={ formData.limit.value}
              value={formData.limit.value}
              onChange={(e)=>{
                setFormData({
                  limit: {value: e.target.value, error: "", isValid: true},
                })
              }}
              //onChange={(e)=>setField({type:"set",field:"password",value:e.target.value})}
              name="limit"
              type="number"
              placeholder="ingrese el limite de paginas"
              // defaultValue={fields.password.value}
              // value={fields.password.value}
              className={`w-1/2 rounded-lg border border-stroke focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
  
            />
          
           
          </div>
  
  
  
        </div>

        <button type="submit" onClick={(e)=>{
          e.preventDefault()
          
          console.log("pagination.label:----------------------------->",pagination.label)
         
           updateValue({
            ...storedValue,
              [pagination.label]:{
              ...storedValue[pagination.label],
              limit: formData.limit.value
            }
          }) 


          dispatch(setLimit({
            ...pagination.limit,
            [pagination.label]:{
              ...pagination.limit[pagination.label],
              limit:formData.limit.value
            }
          }))

          setNotification({
            message:"Limite de paginas actualizado",
            type:"success"
          })
          showNotification()

          toggleModal()

        }}   
        className="bg-primary text-white px-4 py-2 rounded-md">Guardar</button>
           </form>
   </>
  )
}


export default PaginationModal