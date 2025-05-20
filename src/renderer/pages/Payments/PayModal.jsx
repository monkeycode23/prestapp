import React, { useState } from "react";
import Modal from "../../components/Modal";
import { useModal } from "../../components/Modal";
import { useNotification } from "../../components/Notifications";

import { useDispatch, useSelector } from "react-redux";
import {
  setPayments,
  updatePayment,
  setPaymentsCount,
} from "../../redux/reducers/payments.jsx";
import Select from "../../components/Forms/SelectGroup/Select.jsx";
import { MoneyBillAlt } from "../../components/Icons.jsx";
import { payPayment } from "../Loan/funcs";
import { setBruteGains, setNetGains } from "../../redux/reducers/gains";
import { toLocaleDate } from "../Payments/funcs";
import { setNotes } from "../../redux/reducers/notes";

function PayModal({ payment, button }) {
  const { setNotification, showNotification } = useNotification();
  const dispatch = useDispatch()
  return (
    <Modal
      title={"Pagar cuota"}
      button={
        <button className={`flex items-center gap-2 px-4 py-2  font-medium  `}>
          {" "}
          <MoneyBillAlt /> Pagar
        </button>
      }
    >
      <FormModal payment={payment}></FormModal>
    </Modal>
  );
}

function FormModal({ payment }) {
  //console.log(payment)

  const dispatch = useDispatch();
  // const {setPayments} = useTodayPayments()
  const { setNotification, showNotification } = useNotification();
  const { toggleModal } = useModal();
  // const [monto,setMonto] = useState()
  const [paymentMethod, setPaymentMethod] = useState();
  const paymentsCount = useSelector((state) => state.payments.paymentsCount);
  const gains = useSelector((state) => state.gains);
  async function onClick(e) {
  //  alert();

    /* await window.database.models.Payments.updatePayment({
      id: payment.id,

      payment_method: paymentMethod,
    }); */
    const res = await payPayment(payment.id, { id: payment.loan_id });
    //console.log(res)

   await window.database.models.Notes.deleteQuery({
      where:`payment_id = ${payment.id}`
    })

    dispatch(setNotes('Notas del pago...'))

    //console.log("payment.gains",payment)
    if (payment.status == "pending") {
      dispatch(
        setPaymentsCount({
          ...paymentsCount,
          paid: paymentsCount.paid + 1,
          pending: paymentsCount.pending - 1,
        })
      );
      dispatch(setBruteGains(gains.bruteGains + payment.gain));
      dispatch(setNetGains(gains.netGains + payment.amount));
    }
    if (payment.status == "incomplete") {
      dispatch(
        setPaymentsCount({
          ...paymentsCount,
          paid: paymentsCount.paid + 1,
          incomplete: paymentsCount.incomplete - 1,
        })
      );
    }
    if (payment.status == "expired") {
      dispatch(
        setPaymentsCount({
          ...paymentsCount,
          paid: paymentsCount.paid + 1,
          expired: paymentsCount.expired - 1,
        })
      );
      dispatch(setBruteGains(gains.bruteGains + payment.gain));
      dispatch(setNetGains(gains.netGains + payment.amount));
    }

    dispatch(
      updatePayment({
        id: payment.id,
        payment: {
          ...payment,
          status: "paid",
          payment_date: toLocaleDate(new Date()),
        },
      })
    ); /**/
    /*  e.preventDefault()
        console.log("asdasd")
        console.log(payment)
        console.log(monto)

        await window.database.models.Payments.updatePayment({
            id:payment.id,
            status:"paid",
            incomplete_amount:monto,
            paid_date:"NULL",
        })

        await window.database.models.Notes.createNote({
            payment_id:payment.id,
            notes:"Pago incompleto,monto pagado "+monto+" resta por pagar "+payment.amount+" para completar el pago (los pagos incompletos no estan acoplados al calculo de la ganancia)",
        })

        dispatch(updatePayment({
            id:payment.id,
            payment:{
                ...payment,
            status:"incomplete",
            incomplete_amount:monto,
            paid_date:null,
            }
            
        }))
 */
    /* setPayments((prev)=>prev.map((e)=>{

            if(e.paymentId==payment.paymentId){
                return {
                    ...e,
                    state:"incomplete",
                    
                }
            }else{
                return e
            }
        })) */

    toggleModal();

    setNotification({
      type: "success",
      message: "Pago realizado correctamente",
    });
    showNotification();
  }

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
            Metodo de Pago usado para pagar esta cuota
          </label>
          <Select
            className="w-full"
            onChange={async (e) => setPaymentMethod(e.target.value)}
            options={[
              {
                label: "Efectivo",
                value: "cash",
                selected: true,
              },
              {
                label: "Transferencia",
                value: "transfer",
                selected: false,
              },

              {
                label: "Cheque",
                value: "check",
                selected: false,
              },
            ]}
          ></Select>
        </div>

        <button
          onClick={onClick}
          className="p-3 rounded-sm bg-primary text-white"
        >
          finalizar
        </button>
      </form>
    </>
  );
}

export default PayModal;

//console.log(`Pagando ${payment.nickname}`);
//console.log(payment)
//console.log(payment.paymentId)
