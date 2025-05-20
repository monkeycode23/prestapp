import React,{useState,useReducer, useEffect} from "react"



function reducer(state, action) {

   
    if (action.type === 'set') {
      return {
        ...state,
        [action.field]:{  
            ...state[action.field],
            error:"",
            isValid:true,
            value:action.value
          }
        
      };

    }
    if (action.type === 'error') {
      console.log("action.field:>>>",action.field)
        return {
          ...state,
          [action.field]:{
            ...state[action.field],
            isValid:false,
            error:action.error
          }
          
        };
        
      }
      
      if (action.type === 'validate') {
        return {
          ...state,
          [action.field]:{
            ...state[action.field],
            error:"",
            isValidated:true
          }
          
        };
        
      }
    throw Error('Unknown action.');
  }
  
  const validationsFuncs={
   
    minLength:(value,param)=> value.length>=param,
    maxLength:(value,param)=>value.length<=param,
    required:(value)=>{
      console.log("value:>>>",value)
      return value ? true : false},
    email:(value)=>/^[\w\.-]+@[\w-]+\.[\w-]{2,}$/.test(value),
    match:(value,param)=>value==param,
    phonenumber:(phone) =>{
      const regex = /^(?:\+54|54)?(9?[1-9]\d{1,4})?([6-8]\d{6,7})$/;
      return regex.test(phone);
    },
    min:(value,param)=>value>param,
    max:(value,param)=>value<param,
    alpha:(value)=>/^[a-zA-Z]+$/.test(value),
    numeric:(value)=>/^\d+$/.test(value),
    alphaNumeric:(value)=>/^[a-zA-Z0-9]+$/.test(value),
    telephone:(value)=>value.length==10,
    alias:(value)=>value.length==10,
    date: (value)=>{
      const fecha = new Date(value);
      return !isNaN(fecha.getTime());
    },
    custom: async (value,param,fn)=>{

        const r = await fn(value)
        console.log("r:>>>",r)
        return r
    
    }
}

const errMessages = {
    minLength:"Este campo tiene que ser mayor a  ? ",
    maxLength:"Este campo tiene que ser menor a  ? ",
    require:"Este campo es requerido ",
    email:"Este campo debe ser una direccion de email valida"
} 

export default  function useValidate(values){

    const [fieldErrors,setFieldErrors] = useState({})
    const [isValidated,setIsValidated] = useState(true) 
    const [fields, dispatch] = useReducer(reducer,values);

    
    async function validate(validations){

        const errors ={}
        const validationPromises = []; 
        for (const field in validations) {
               
            const input= validations[field]

            const value = fields[field].value || ''
            
           // console.log(value)
           
            for (const validation in validations[field]) {
                 
                const currentValidation = input[validation]
                
                const param = currentValidation.param;
                const fn = currentValidation.fn ? currentValidation.fn : null;

                
                const fnc = validationsFuncs[validation]
                let isValid 
               
                /* if(fnc.constructor.name === 'AsyncFunction'){
                    validationPromises.push(
                        fnc(value,param,fn).then(valid => {
                          console.log("validas:>>>",valid)
                            if (!valid) {
                                errors[field] = false;

                                dispatch({ type: "error", field: field, error: currentValidation.message || errMessages[validation].replace("?", param || '') });
                          
                                return 
                              } else {
                                delete errors[field];
                                dispatch({ type: "validate", field: field });
                            }
                        })
                    );
                }else{ */
                    isValid = fnc(value,param,fn)
                    if (!isValid) {

                        errors[field] = false;
                        dispatch({ type: "error", field: field, error: currentValidation.message || errMessages[validation].replace("?", param || '') });
                        setFieldErrors(prev=>({...prev,[field]:currentValidation.message || errMessages[validation].replace("?", param || '')}))
                        break
                      } else {
                        delete errors[field];
                        setFieldErrors(prev=>{
                          const cp = Object.create(prev)
                          delete cp[field]
                          return cp
                        })
                        dispatch({ type: "validate", [field]: field });
                    }
               /*  } */
             
                 //console.log("isValid:>>>",isValid,field,validation)  

                }    
            }

       //  console.log(errors)
            
      
            await Promise.all(validationPromises);


            console.log("errors:>>>",fields)
            console.log("fieldErrors:>>>",fieldErrors)

            return Object.keys(errors).length==0
            
            
        }
        

        return {
            validate,
            //errors,
            fieldErrors,
            fields,
            setField:dispatch
        }
    }

   
    
    
