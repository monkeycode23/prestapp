import React,{useState,useEffect,useRef} from "react";

import Modal from "../../../components/Modal"


import {GuidedForm,StepForm,useGuide} from "../../../components/GuidedForm/GuidedForm"


import Step1 from "./Step1"
import Step2 from "./Step2"
import Step5 from "./finance"
import Step3 from "./basic"
import Step4 from "./contact"
import { UserIcon } from "../../../components/Icons";




export function AddClientModal({addClient,button}) {

 
  return (
    <Modal buttonLabel={"agregar"} button={button} title={"Agregar Cliente"}>
        <GuidedForm updateState={addClient}
         initState={
          {
            nickname: {value:"",error:"",isValid:true},
            email: {value:"",error:"",isValid:true},
            address: {value:"",error:"",isValid:true},
            phone: {value:"",error:"",isValid:true},
            birthdate: {value:"",error:"",isValid:true},
            name: {value:"",error:"",isValid:true},
            lastname: {value:"",error:"",isValid:true},
            gender: {value:"",error:"",isValid:true},
            status: {value:"",error:"",isValid:true},
            document_id: {value:"",error:"",isValid:true},
            cbu: {value:"",error:"",isValid:true},
            alias: {value:"",error:"",isValid:true},
            
          }
        }>
          <StepForm targetStep={1}>
              <Step1></Step1>
          </StepForm>
          <StepForm targetStep={2}>
             <Step2></Step2>
          </StepForm>
          <StepForm targetStep={3}>
             <Step3></Step3>
          </StepForm>
          <StepForm targetStep={4}>
             <Step2></Step2>
          </StepForm>
          <StepForm targetStep={5}>
             <Step4></Step4>
          </StepForm>
        </GuidedForm>
      </Modal>
  )
}






