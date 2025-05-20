import React, { useState, useEffect } from "react";
import Modal, { useModal } from "../Modal";

import Select from "../Forms/SelectGroup/Select";

import { useDispatch, useSelector } from "react-redux";
import { setLoan } from "../../redux/reducers/loans";

import { createPayments } from "../../pages/Client/funcs";
import { setPayments } from "../../redux/reducers/payments";
import { setBruteGains, setNetGains } from "../../redux/reducers/payments";

function EditLoanModal({ loan, button }) {
  return (
    <Modal title={"Editar Prestamo"} button={button}>
      <EditLoanForm loan={loan}></EditLoanForm>
    </Modal>
  );
}

function EditLoanForm({ loan }) {
  const dispatch = useDispatch();
  loan = loan ? loan : useSelector((state) => state.loans.loan);

  const {
    label,
    payment_interval,
    interest_rate,
    amount,
    id,
    installment_number,
    status,
    loan_date,
    generate_payments_date,
  } = loan;

  // console.log(id)

  // console.log(payment)
  // console.log(loan)

  const { showNotification, setNotification } = useNotification();

  const { toggleModal } = useModal();

  const [formData, setFormData] = useState({
    id: {
      value: id,
      error: "",
    },

    generate_payments_date: {
      value: generate_payments_date,
      error: "",
    },

    amount: {
      value: Number(amount),
      error: "",
    },

    installment_number: {
      value: installment_number,
      error: "",
    },

    interest_rate: {
      value: interest_rate,
      error: "",
    },
    loan_date: {
      value: loan_date,
      error: "",
    },

    label: {
      value: label,
      error: "",
    },
    payment_interval: {
      value: payment_interval,
      error: "",
    },
    status: {
      value: status,
      error: "",
    },
  });

  function setField({ type, field, value }) {
    if (type == "set") {
      // console.log(value)
      setFormData((prev) => {
        return {
          ...prev,
          [field]: {
            ...formData[field],
            value: value,
          },
        };
      });
      // console.log(formData[field])
    }

    if (type == "error") {
      setFormData((prev) => {
        return {
          ...prev,
          [field]: {
            ...formData[field],
            error: value,
          },
        };
      });
    }
  }

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
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
            onChange={(e) =>
              setField({ type: "set", field: "label", value: e.target.value })
            }
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
            onChange={(e) =>
              setField({ type: "set", field: "amount", value: e.target.value })
            }
            defaultValue={formData.amount.value}
            value={formData.amount.value}
            formNoValidate
          />
        </div>
        <div className="flex  ">
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
              Interes del prestamo
            </label>
            <input
              name="interes"
              type="number"
              placeholder="Ingresa el monto del pago"
              className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              onChange={(e) =>
                setField({
                  type: "set",
                  field: "interest_rate",
                  value: e.target.value,
                })
              }
              defaultValue={formData.interest_rate.value}
              value={formData.interest_rate.value}
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
              onChange={(e) =>
                setField({
                  type: "set",
                  field: "installment_number",
                  value: e.target.value,
                })
              }
              defaultValue={formData.installment_number.value}
              value={formData.installment_number.value}
              formNoValidate
            />
          </div>
        </div>

        <div className="flex">
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
              Fecha entrega Prestamo
            </label>
            <input
              name="date"
              type="date"
              placeholder="fecha del pago"
              className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              onChange={(e) =>
                setField({
                  type: "set",
                  field: "loan_date",
                  value: e.target.value,
                })
              }
              defaultValue={formData.loan_date.value}
              value={formData.loan_date.value}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
              Fecha primer pago
            </label>
            <input
              name="date"
              type="date"
              placeholder="fecha del primer  pago"
              className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              onChange={(e) =>
                setField({
                  type: "set",
                  field: "generate_payments_date",
                  value: e.target.value,
                })
              }
              defaultValue={formData.generate_payments_date.value}
              value={formData.generate_payments_date.value}
            />
          </div>
        </div>

        <div className="flex ">
          <div className="w-1/2">
            <Select
              label={"Estado del prestamo"}
              onChange={(e) =>
                setField({
                  type: "set",
                  field: "status",
                  value: e.target.value,
                })
              }
              options={[
                {
                  label: "Completado",
                  value: "cmpleted",
                  selected: status == "competed",
                },
                {
                  label: "Cancelado",
                  value: "canceled",
                  selected: status == "canceled",
                },
                {
                  label: "Activo",
                  value: "active",
                  selected: status == "active",
                },
              ]}
            ></Select>
          </div>

          <div className="w-1/2">
            <Select
              label={"Periodo de pagos"}
              onChange={(e) =>
                setField({
                  type: "set",
                  field: "payment_interval",
                  value: e.target.value,
                })
              }
              options={[
                {
                  label: "diario",
                  value: "daily",
                  selected: payment_interval == "daily",
                },
                {
                  label: "semanal",
                  value: "weekly",
                  selected: payment_interval == "weekly",
                },
                {
                  label: "mensual",
                  value: "monthly",
                  selected: payment_interval == "monthly",
                },
                {
                  label: "quincenal",
                  value: "fortnightly",
                  selected: payment_interval == "fortnightly",
                },
                {
                  label: "custom",
                  value: "custom",
                  selected: payment_interval == "custom",
                },
              ]}
            ></Select>
          </div>
        </div>

        <button
          onClick={async () => {
            console.log("-------------->>form data",formData);

            const gain = (Number(formData.amount.value)*Number(formData.interest_rate.value)/100)
            const totalAmount= Number(formData.amount.value)+Number(gain)
            console.log("totalAmount:----------------------------->",totalAmount)
           
            window.database.models.Loans.updateLoan({
              id: formData.id.value,
              amount: formData.amount.value,
              total_amount: totalAmount,
              status: formData.status.value,
                gain:gain,
              payment_interval: formData.payment_interval.value,
              loan_date: formData.loan_date.value,
              installment_number: formData.installment_number.value,
              interest_rate: formData.interest_rate.value,
              label: formData.label.value,
            });

           

            const generate =
              window.confirm(`Uno de los valores del prestamo que afecta a
                         las cuotas ha cambiado desea autogenerar las cuotas nuevamente?
                        Cuidado al hacer esto se borraran todas las cuotas actuales del prestamo
                        `);
            if (generate) {
              //deete curent cuotas
              console.log("asdaisdaksjdhajksdwasdunaasdasdnlasdnk")
              await window.database.models.Payments.deleteMany({
                where: `loan_id='${loan.id}'`,
              });

            console.log("formData:----------------------------->",formData)
              const payments = await createPayments({
                ...loan,
                amount: formData.amount.value,
                status: formData.status.value,
                payment_interval: formData.payment_interval.value,
                total_amount: totalAmount,
                loan_date: formData.loan_date.value,
                installment_number: formData.installment_number.value,
                interest_rate: formData.interest_rate.value,
                label: formData.label.value,
              });

              dispatch(setPayments(payments));

              dispatch(setBruteGains(0))
              dispatch(setNetGains(0))
              
              dispatch(
                setLoan({
                  ...loan,
                  amount: formData.amount.value,
                  status: "active",
                  total_amount: totalAmount,
                  payment_interval: formData.payment_interval.value,
                  loan_date: formData.loan_date.value,
                  installment_number: formData.installment_number.value,
                  interest_rate: formData.interest_rate.value,
                  label: formData.label.value,
                })
              );

              window.database.models.Loans.updateLoan({
                id:loan.id,
                
                status:"active",
                
              })
            }else{
                dispatch(
                    setLoan({
                      ...loan,
                      amount: formData.amount.value,
                      status: formData.status.value,
                      total_amount: totalAmount,
                      payment_interval: formData.payment_interval.value,
                      loan_date: formData.loan_date.value,
                      installment_number: formData.installment_number.value,
                      interest_rate: formData.interest_rate.value,
                      label: formData.label.value,
                    })
                  );
            }
           
              toggleModal();

            setNotification({
              type: "success",
              message: "Prestamo actualizado con exito",
            });

            showNotification();

            /*  if(loans!=null){
                            setLoans((prev)=>prev.map((p)=>p.id==loan.id ? {
                                ...p,
                                amount:formData.amount.value,
                                state:formData.state.value,
                                installments:formData.installments.value,
                                payment_interval:formData.interval.value,
                                aproved_date:formData.date.value,
                                label:formData.label.value,
                                interes_percentage:formData.interes.value,
                            } : p))
                        } */
          }}
          className="p-3 bg-primary text-white"
        >
          editar
        </button>
      </form>
    </div>
  );
}

import { useNotification } from "../../components/Notifications";

import {updateLoan} from "../../redux/reducers/loans"

export default EditLoanModal;
