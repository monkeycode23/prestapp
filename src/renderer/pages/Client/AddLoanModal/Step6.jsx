import React, { useState, useEffect } from "react";
import { useNotification } from "../../../components/Notifications";
import { useModal } from "../../../components/Modal";
import { useGuide } from "../../../components/GuidedForm/GuidedForm";
import { setDebt, setTotalLendMoney } from "../../../redux/reducers/clients";
import SelectGroupOne from "../../../components/Forms/SelectGroup/SelectGroupOne";

import { useSelector, useDispatch } from "react-redux";
import { createPayments, insertLoanMongo } from "../funcs";
import { setLoans, addLoan, setTotalLoans, setLeftToPaid } from "../../../redux/reducers/loans";
import { setPaymentsCount } from "../../../redux/reducers/payments";

// Services
import loansService from "../../../services/loansService.js";

// Activity Log Function (Idealmente mover a utils)
const addActivityLog = async (actionType, entityType, entityId, payloadObject, explicitSyncStatus = null) => {
  const isOnline = navigator.onLine;
  const currentSyncStatus = explicitSyncStatus !== null ? explicitSyncStatus : (isOnline ? 1 : 0);
  try {
    const logEntry = {
      action_type: actionType,
      entity: entityType,
      entity_id: entityId ? entityId.toString() : null,
      payload: JSON.stringify(payloadObject),
      synced: currentSyncStatus,
    };
    await window.database.models.ActivityLog.createActivity(logEntry);
    console.log("Activity logged from AddLoanModal/Step6 (new format):", logEntry);
  } catch (error) {
    console.error("Failed to add activity log from AddLoanModal/Step6 (new format):", error);
  }
};

const Step6 = () => {
    const { formData, disableNext, nextStep, handleChange, enableNext, registerOnNext, registerOnBack, validate, setField, goToStep } = useGuide();
    const client = useSelector((state) => state.clients.client);
    const { id: clientId } = client; // Renombrado para claridad, es el ID del cliente
    const dispatch = useDispatch();
    const { toggleModal } = useModal(); // showModal no se usaba
    const { setNotification, showNotification } = useNotification();
    const totalLoansFromState = useSelector((state) => state.loans.totalLoans); // Renombrado para claridad
    const paymentsCount = useSelector((state) => state.payments.paymentsCount);
    // leftToPaid no se usa directamente en este fragmento
    const currentDebt = useSelector((state) => state.clients.debt); // Renombrado
      const clientState = useSelector((state) => state.clients); // Renombrado
      const loans = useSelector((state) => state.loans.loans);

    useEffect(() => {
        enableNext();
        registerOnBack(() => {
            goToStep(4);
        });

        registerOnNext(async () => {
            const errors = validate({
                generated_payments_date: {
                    required: { param: true, message: "Este campo es requerido para avanzar" },
                }
            });

            if (errors) { // La lógica original procedía si `errors` era true, lo cual es extraño. Asumo que quería decir !errors o que validate devuelve el objeto si es válido.
                          // Por el código original, parece que `validate` devuelve `true` si NO hay errores.
                const gains = Math.floor(Number(formData.amount.value) * Number(formData.interest_rate.value) / 100);
                const labelNumber =window. database.models.Loans.getLoans({
                select:"count(*)  as total",
                  where:"client_id=" + clientId
                })

                console.log("labelNumber:----------------------------->",labelNumber)
                const loanDataForLocalDB = {
                    amount: formData.amount.value,
                    label: "prestamo n° " + (loans.length+ 1),
                    gain: gains,
                    status: "active",
                    installment_number: formData.installments.value,
                    total_amount: Number(formData.amount.value) + Number(gains),
                    loan_date: formData.loan_date.value,
                    interest_rate: formData.interest_rate.value,
                    payment_interval: formData.payment_interval.value,
                    generate_payments_date: formData.generated_payments_date.value,
                    client_id: clientId
                };

                let localLoan = await insertLoan(loanDataForLocalDB); // Guardar en BD local primero
                let apiLoanId = localLoan.id; // Usar ID local como fallback
                let syncStatus = 0;

                const payments = await createPayments(localLoan, formData.sunday.value);
                console.log("Payments created locally:", payments);
                // Preparar datos para la API (ajustar campos según lo que espere tu API)
               /*  const loanDataForAPI = {
                    cliente: clientId, // Asegúrate que el backend espera 'cliente' o 'client_id'
                    amount: Number(formData.amount.value),
                    label: "prestamo n° " + (labelNumber + 1),
                    interest_rate: Number(formData.interest_rate.value),
                    payment_interval: Number(formData.payment_interval.value), // Asegúrate que el tipo sea el esperado
                    loan_date: formData.loan_date.value,
                    // Campos adicionales que tu API pueda necesitar para crear el préstamo
                    // como installment_number, total_amount, status, etc.
                    // Aquí asumo algunos basados en loanDataForLocalDB
                    installment_number: parseInt(formData.installments.value, 10),
                    total_amount: Number(formData.amount.value) + Number(gains),
                    status: "active", // O el estado inicial que defina tu API
                    fechaDesembolso: formData.loan_date.value, // O el campo que use tu API
                    montoCuota: (Number(formData.amount.value) + Number(gains)) / parseInt(formData.installments.value, 10),
                    // Es crucial que los nombres de campo coincidan con lo que espera tu endpoint POST /prestamos
                }; */

                try {
                   // console.log("Enviando a API /prestamos:", loanDataForAPI);
                    const createdApiLoan = await loansService.createPrestamo({
                      prestamo: localLoan,
                      payments: payments
                    });
                    console.log("Préstamo creado vía API:", createdApiLoan);
                    syncStatus = 1;
                    apiLoanId = createdApiLoan.id; // Usar el ID de la API si está disponible
                    // Si la API devuelve el objeto completo, podrías actualizar localLoan con datos de la API
                    localLoan = { ...localLoan, ...createdApiLoan, id: createdApiLoan.id || localLoan.id }; 
                } catch (apiError) {
                    console.error("Error al crear préstamo vía API:", apiError);
                    syncStatus = 0;
                    // Manejar el error, quizás mostrar una notificación al usuario.
                    // El préstamo ya está en la BD local, se intentará sincronizar después.
                    setNotification({
                        type: "warning",
                        message: "Préstamo guardado localmente, error al sincronizar con el servidor."
                    });
                    showNotification();
                }
                
                // Registrar actividad usando apiLoanId (preferiblemente) o el ID local
               // await addActivityLog("CREATE", "loans", apiLoanId, loanDataForAPI, syncStatus);

               
                // Aquí podrías tener una lógica para sincronizar pagos si es necesario, 
                // o si la creación de pagos depende del ID del préstamo de la API.

                dispatch(addLoan(localLoan)); // Usar localLoan que podría estar enriquecido con datos de la API
                dispatch(setTotalLoans(totalLoansFromState + 1));
                dispatch(setDebt(currentDebt + (Number(formData.amount.value) + gains)));
                dispatch(setTotalLendMoney(clientState.totalLendMoney + localLoan.amount));
                dispatch(setPaymentsCount({
                    ...paymentsCount,
                    pending: paymentsCount.pending + parseInt(formData.installments.value,10), // Asegurar que sumas correctamente
                }));
                
                toggleModal();
                setNotification({
                    type: syncStatus ? "success" : "warning", // Cambia el tipo de notificación según el syncStatus
                    message: syncStatus ? "Préstamo agregado con éxito." : "Préstamo agregado localmente, fallo al sincronizar."
                });
                showNotification();
            } else {
                 // Si hubo errores de validación iniciales (según la lógica original)
                 console.log("Errores de validación en Step6, no se procede a crear préstamo.", validate(null, true) /*para ver los errores*/);
            }
        });
    }, [registerOnNext, client, formData, totalLoansFromState, paymentsCount, currentDebt, clientState, dispatch, toggleModal, setNotification, showNotification, goToStep, enableNext, validate, setField]); // Dependencias actualizadas

    return (
      <div className="mb-4">
        <h3 className=" text-xl font-semibold p-3  pb-7 block text-black dark:text-white text-center ">
          Especifique las fechas del primer pago
        </h3>
        <div className="relative">
          <input
  
            name="fecha"
            type="date"
            placeholder="Ingresa tu nombre de usuario"
            className={`w-full rounded-lg border border-stroke  focus:text-black  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
            onChange={(e) => setField({ type: "set", field: "generated_payments_date", value: e.target.value })
            }
            defaultValue={formData.generated_payments_date.value}
            value={formData.generated_payments_date.value}
          />
  
  
          <p className="text-center text-red ">
            {
              formData.generated_payments_date.error ? formData.generated_payments_date.error : ""
            }
          </p>
  
        </div>
      </div>
    )
  }
  

  import { insertLoan } from "../funcs";

  export default Step6;