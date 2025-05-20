
import React, { useState, useEffect } from "react";



import Modal,{ useModal } from "../../../components/Modal";


import { GuidedForm, StepForm, useGuide } from "../../../components/GuidedForm/GuidedForm";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";


//redux
import { useSelector } from "react-redux";

export function AddLoanModal({button}) {

//  const client = useSelector(state => state.clients.client)

const client = useSelector(state => state.clients.client)

console.log("client ASASDASD",client)
  return (
    <Modal buttonLabel={"dar prestamo"} button={button} title={"Otorgar Prestamo"}>

      <GuidedForm
        initState={{
          label: {
            value: "Prestamo ",
            isValid: true,
            error: ""
          },
          amount: {
            value: 5000,
            isValid: true,
            error: ""
          },
          interest_rate: {
            value: 30,
            isValid: true,
            error: ""
          },

          installments: {
            value: 0,
            isValid: true,
            error: ""
          },
          payment_interval: {
            value: "",
            isValid: true,
            error: ""
          },
          loan_date: {
            value: "",
            isValid: true,
            error: ""
          },
          generated_payments_date: {
            value: "",
            isValid: true,
            error: ""
          },
          clientId: {
            value: 1,
            isValid: true,
            error: ""
          },
          userId: {
            value: 1,
            isValid: true,
            error: ""
          },
          sunday:{
            value: true,
            isValid: true,
            error: ""
          }

        }}>
        <StepForm targetStep={1}>
          <Step1></Step1>
        </StepForm>

        <StepForm targetStep={2} >
          <Step2></Step2>
        </StepForm>
        <StepForm targetStep={3} >
          <Step3></Step3>
        </StepForm>
        <StepForm targetStep={4} >
          <Step4 ></Step4>
        </StepForm>
        <StepForm targetStep={5}>
          <Step5 ></Step5>
        </StepForm>

        <StepForm targetStep={6} >
          <Step6></Step6>
        </StepForm>


      </GuidedForm>

    </Modal>
  )
}




/* function  GuidedFormModal() {
    const {token} = useAuth()

    const {decodedToken, isExpired } = useJwt(token);

    const {toggleModal} = useModal()
   
   
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleForm =async  (e) => {


        const gains = ((formData.monto*formData.interes)/100);

        const amount = formData.monto+gains


       await  window.sqlite.query(`INSERT INTO loans
         (gains,amount,installments,interes_percentage,aproved_date,payment_interval,client_id,lender_id) 
        VALUES
        ('${gains}',
        '${formData.monto}',
        '${formData.cuotas}',
        '${formData.interes}',
        '${formData.fecha}',
        '${formData.pagos}',
        '${formData.clientId}',
        '${1}'
        );
        `)

       
            
        }

        toggleModal()
    };
  return (
   
  )
} */

export default AddLoanModal

