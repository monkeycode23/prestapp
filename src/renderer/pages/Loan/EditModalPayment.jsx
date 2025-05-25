import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import Select from "../../components/Forms/SelectGroup/Select";
import { useNotification } from "../../components/Notifications";
import { useModal } from "../../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { updatePayment, setBruteGains, setNetGains } from "../../redux/reducers/payments";
import { updateLoan, setLoan } from "../../redux/reducers/loans";

function EditModalPayment({ payment, button }) {
  return (
    <Modal buttonLabel={"edit"} title={"Editar Pago"} button={button}>
      <EditPaymentForm payment={payment}></EditPaymentForm>
    </Modal>
  );
}

function EditPaymentForm({ payment }) {
  const { setNotification, showNotification } = useNotification();
  const { toggleModal } = useModal();
  const dispatch = useDispatch();
  const loan = useSelector((state) => state.loans.loan);
  const bruteGains = useSelector((state) => state.payments.bruteGains);
  const netGains = useSelector((state) => state.payments.netGains);
  const currentStatus = payment.status;

  const [formData, setFormData] = useState({
    amount: {
      value: typeof payment.amount === "object" ? "" : payment.amount,
      error: "",
    },
    payment_date: {
      value: payment.payment_date,
      error: "",
    },
    label: {
      value: payment.label,
      error: "",
    },
    status: {
      value: payment.status,
      error: "",
    },
  });

  // Estados extra para monto abonado, fecha pagada y método de pago
  const [amountPaid, setAmountPaid] = useState(payment.amount_paid || 0);
  const [amountPaidError, setAmountPaidError] = useState("");
  const [paidDateInput, setPaidDateInput] = useState(payment.paid_date || "");
  const [paymentMethod, setPaymentMethod] = useState(payment.payment_method || "efectivo");

  useEffect(() => {
    // Reset inputs si el estado cambia a otro distinto
    if (formData.status.value !== "incomplete") {
      setAmountPaid(0);
      setAmountPaidError("");
    }
    if (formData.status.value !== "paid") {
      setPaidDateInput("");
      setPaymentMethod("efectivo"); // reset método pago si no está pagado
    }
  }, [formData.status.value]);

  function setField({ type, field, value }) {
    if (type === "set") {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          value,
        },
      }));
    }
    if (type === "error") {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          error: value,
        },
      }));
    }
  }

  const handleAmountPaidChange = (e) => {
    const value = Number(e.target.value);
    if (value > formData.amount.value) {
      setAmountPaidError("El monto abonado no puede ser mayor al monto total.");
    } else {
      setAmountPaidError("");
      setAmountPaid(value);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()} noValidate={true}>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
            Etiqueta
          </label>
          <input
            step={1000}
            name="label"
            type="text"
            placeholder="Ingresa el monto del pago"
            className={`w-full rounded-lg border border-stroke focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
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
            name="amount"
            type="number"
            min={5000}
            placeholder="Ingresa el monto del pago"
            className={`w-full rounded-lg border border-stroke focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) =>
              setField({ type: "set", field: "amount", value: Number(e.target.value) })
            }
            defaultValue={formData.amount.value}
            value={formData.amount.value}
            formNoValidate
          />
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
            Fecha del Pago
          </label>
          <input
            name="payment_date"
            type="date"
            placeholder="fecha del pago"
            className={`w-full rounded-lg border border-stroke focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) =>
              setField({ type: "set", field: "payment_date", value: e.target.value })
            }
            defaultValue={formData.payment_date.value}
            value={formData.payment_date.value}
          />
        </div>

        <Select
          label={"Estado del pago"}
          onChange={(e) =>
            setField({ type: "set", field: "status", value: e.target.value })
          }
          options={[
            {
              label: "pagado",
              value: "paid",
              selected: payment.status === "paid",
            },
            {
              label: "vencido",
              value: "expired",
              selected: payment.status === "expired",
            },
            {
              label: "pendiente",
              value: "pending",
              selected: payment.status === "pending",
            },
            {
              label: "incompleto",
              value: "incomplete",
              selected: payment.status === "incomplete",
            },
          ]}
        />

        {/* Mostrar input para monto abonado si está incompleto */}
        {formData.status.value === "incomplete" && (
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
              Monto abonado
            </label>
            <input
              type="number"
              min={0}
              max={formData.amount.value}
              step={100}
              value={amountPaid}
              onChange={handleAmountPaidChange}
              className={`w-full rounded-lg border border-stroke focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            />
            {amountPaidError && (
              <p className="text-red-600 mt-1 text-sm">{amountPaidError}</p>
            )}
          </div>
        )}

        {/* Mostrar input para fecha pagada si está pagado */}
        {formData.status.value === "paid" && (
          <>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                Fecha del pago realizado
              </label>
              <input
                type="date"
                value={paidDateInput}
                onChange={(e) => setPaidDateInput(e.target.value)}
                className={`w-full rounded-lg border border-stroke focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              />
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-left text-black dark:text-white">
                Método de pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={`w-full rounded-lg border border-stroke focus:text-black bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
              >
                <option value="cash">Efectivo</option>
                <option value="transfer">Transferencia</option>
                <option value="credit card">Tarjeta Credito</option>
              </select>
            </div>
          </>
        )}

        <button
          onClick={async () => {
            // Validación monto abonado
            if (formData.status.value === "incomplete" && amountPaid > formData.amount.value) {
              setAmountPaidError("El monto abonado no puede ser mayor al monto total.");
              return;
            }

            let gains = payment.gain;
            if (payment.amount !== formData.amount.value) {
              gains = Math.round((formData.amount.value * 30) / 100);
            }

            let paid_date =
              payment.status === "paid" && formData.status.value !== "paid"
                ? null
                : paidDateInput;

            // Actualizar en base de datos
            await window.database.models.Payments.updatePayment({
              id: payment.id,
              amount: formData.amount.value,
              payment_date: formData.payment_date.value,
              label: formData.label.value,
              status: formData.status.value,
              gain: gains,
              net_amount: formData.amount.value - gains,
              paid_date:formData.status.value === "paid" ? paid_date : null,
              incomplete_amount: formData.status.value === "incomplete" ? amountPaid : null,
              payment_method: formData.status.value === "paid" ? paymentMethod : "cash",
            });

            // Actualizar redux
            dispatch(
              updatePayment({
                id: payment.id,
                payment: {
                  ...payment,
                  amount: formData.amount.value,
                  payment_date: formData.payment_date.value,
                  label: formData.label.value,
                  status: formData.status.value,
                  gain: gains,
                  net_amount: formData.amount.value - gains,
                  paid_date:formData.status.value === "paid" ? paid_date : null,
              incomplete_amount: formData.status.value === "incomplete" ? amountPaid : null,
              payment_method: formData.status.value === "paid" ? paymentMethod : "cash"
                },
              })
            );

            // Actualizar el préstamo si monto cambia
            if (payment.amount !== formData.amount.value) {
              const newLoanAmount = loan.amount - payment.amount + formData.amount.value;
              dispatch(updateLoan({ id: loan.id, loan: { ...loan, amount: newLoanAmount } }));
              dispatch(setLoan({ ...loan, amount: newLoanAmount }));
            }

            // Actualizar ganancias globales
            if (payment.gain !== gains) {
              dispatch(setBruteGains(bruteGains - payment.gain + gains));
              dispatch(setNetGains(netGains - payment.net_amount + (formData.amount.value - gains)));
            }

            toggleModal();
            setNotification({
              type: "success",
              message: "Pago actualizado con éxito",
            });
            showNotification();
          }}
          className="p-3 bg-primary text-white rounded"
        >
          editar
        </button>
      </form>
    </div>
  );
}

export default EditModalPayment;
