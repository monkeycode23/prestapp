import React,{useState,createContext,useContext, useEffect,useRef} from 'react'


import SelectGroupOne from '../Forms/SelectGroup/SelectGroupOne';
import { useModal } from '../Modal.jsx';

import App from '../Notifications.jsx';

import useValidate from '../../hooks/useValidate';
const GuideContext = createContext()




export function useGuide(){
    
    return useContext(GuideContext)
}



export function GuidedForm({initState,updateState,children}) {

  
 
   const {validate,fields,setField,errors} = useValidate(initState)
  

  
   const onNextCallbackRef = useRef(null); 
   const onBackCallbackRef = useRef(null);

   const executeOnNext = () => {
    if (onNextCallbackRef.current) {
      return onNextCallbackRef.current(); // Ejecuta el callback almacenado
    }
    return true; // Por defecto, permite avanzar si no hay callback
  };

  const executeOnBack = () => {
    if (onBackCallbackRef.current) {
      return onBackCallbackRef.current(); // Ejecuta el callback almacenado
    }
    return prevStep(); // Por defecto, permite avanzar si no hay callback
  };

    const handleChange = (e) => {
      
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


 
    const [step, setStep] = useState(1);

    const [onNext,setOnNext]= useState("");

    const [canNext,setCanNext] = useState(true)


        const registerOnNext = (callback) => {
          onNextCallbackRef.current = callback; // Almacena el callback en la referencia
        };

        const registerOnBack = (callback) => {
          onBackCallbackRef.current = callback; // Almacena el callback en la referencia
        };
   /*  const registerOnNext = React.useCallback((callback) => {
      setOnNext(() => callback);
    },[]); */

    const nextStep = () => setStep(step + 1)

    const  prevStep = () => setStep(step - 1)

    const toggleEnableNext = () => setCanNext((prev)=>!prev)  

    const disableNext = () => setCanNext(true)  
    const enableNext = () => setCanNext(false)  
   // const {setTotalSteps} = useGuide()

   const goToStep = (step) => setStep(step)

   const totalSteps = React.Children.toArray(children).length;
    //setTotalSteps(children.length)
    

   
  return (

    <GuideContext.Provider value={{
      updateState,
        step,
        formData:fields,
        goToStep,
        handleChange,
        nextStep,
        prevStep,
        disableNext,
        enableNext,
        canNext,
        registerOnNext,
        registerOnBack,
        executeOnNext,
        executeOnBack,
        validate,
        setField,
       
    }}>
        <div className='p-10'>
        <form onSubmit={(e)=>e.preventDefault()}>

        {React.Children.map(children, (child) => {
          // Pasar el total de pasos a cada StepForm
          return React.cloneElement(child, { totalSteps });
        })}
            
        </form>

        
    </div>
    </GuideContext.Provider>
   
  )
}




 export function StepForm({targetStep,children,totalSteps,handleForm=null}) {

    const { step, nextStep, prevStep,canNext,onNext,executeOnNext,executeOnBack } = useGuide();

    if (step !== targetStep) return null; // Renderiza solo si el paso actual coincide con el `targetStep`
  




  return (
    <>
    {/* <App></App> */}
    {children}

    <div className='mt-5 flex justify-between'>
        {
            <button 
                className='cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90'
                onClick={targetStep == 1 ?  ()=>{} :()=>executeOnBack()}  >prev</button>
        }
        <button disabled={canNext}
        className='cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90'
        onClick={(e)=>{
           

          const shouldContinue = executeOnNext(); // Ejecuta el callback
          /*  console.log(onNext)
          if (onNext) {
            console.log("asdasd12")
            const shouldContinue = onNext(); // Devuelve un valor (opcional)
            if (shouldContinue === false) return; // Si el callback devuelve `false`, no avanza
          } */

          //console.log("asdasd12")
          //if(targetStep == totalSteps)  handleForm(e)
            
          
          

        }}>{targetStep == totalSteps ? "finalizar" : "siguiente"}</button>
    </div>
    </>
  )
}





export default GuidedForm