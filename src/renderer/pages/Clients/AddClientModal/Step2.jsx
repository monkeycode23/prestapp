import React,{ useState,useEffect } from "react"
import { useGuide } from "../../../components/GuidedForm/GuidedForm"
import { useModal } from "../../../components/Modal";
import { useSelector ,useDispatch} from "react-redux";
import { addClient } from "../../../redux/reducers/clients"

function Step2() {

    const clients = useSelector(state => state.clients)
    const dispatch = useDispatch()

    const {toggleModal}= useModal()
  
    const {formData,nextStep,enableNext,registerOnNext,updateState} = useGuide()
  
    const [isValid,setIsValid] = useState(true)
    
  
    useEffect(() => {
  
      
      // Registra el callback para este paso
      registerOnNext(() => {
        console.log("Callback ejecutado desde Step2");
  
        nextStep()
        
        
       
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
            Deseas seguir añadiendo informacion? 
          </label>
          <div className=" text-center relative">
            
            <button className="rounded-sm p-2 bg-success text-white" 
            onClick={async ()=>{
  
              await window.database.models.Clients.createClient({
                nickname:formData.nickname.value,
                user_id:1
              })

              const client = await window.database.models.Clients.getClientLastId()
              
              console.log("client-------------->",client)
              const information = {
                id:client[0].id,
                name:formData.name.value,
                lastname:formData.lastname.value,
                email:formData.email.value,
                address:formData.address.value,
                phone:formData.phone.value,
                status:"activo",
                gender:"masculino",
                birthdate:formData.birthdate.value,
                document_id:formData.document_id.value,
                cbu:formData.cbu.value,
                alias:formData.alias.value
              }
               await window.database.models.Information.createInformation(information) 
  
  
             dispatch(addClient({
              ...information,
              nickname:formData.nickname.value,
             }))
             
              toggleModal()
            }}>
              terminar
          </button>
           
          </div>
  
  
  
        </div>
  
      </div>
    )
  }

  export default Step2