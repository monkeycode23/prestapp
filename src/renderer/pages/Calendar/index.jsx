import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // Importa FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid"; // Importa el plugin para la vista de cuadrícula diaria
import interactionPlugin from "@fullcalendar/interaction"; // Permite la interacción con el calendario (como el clic en un día)
import esLocale from "@fullcalendar/core/locales/es"; // importar el locale en español (ya incluido en FullCalendar)
import timeGridPlugin from "@fullcalendar/timegrid"; // Para la vista de la semana con los días

import { useNotification } from "../../components/Notifications";
import "./calendar.css";

import { useSelector, useDispatch } from "react-redux";

import { getWeekPayments } from "./funcs";
import { getMonday, getSunday } from "../../common/funcs";
import { payPayment } from "../../pages/Loan/funcs";
const Calendar = () => {
  const { showNotification, setNotification } = useNotification();

  const payments = useSelector((state) => state.payments.payments);
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);

  function setDataStateEvents(r) {
    const payments = [];

    for (const row of r) {
      console.log("row:----------------------------->",row)
      payments.push({
        title: row.client_name,
        date: row.payment_day,
        monto: row.monto,
        payment_date:row.payment_day,
        label: row.label,
        name: row.client_name,
        payment_id:row.payment_id,
        color: row.status == "expired" ? "#FF6666" : "#6577F3",
        id: row.payment_id,
        loan_id:row.loan_id,
        loan_label:row.loan_label,
        loan_total_amount:row.loan_total_amount
      });
    }

    console.log("payments:----------------------------->", payments);

    return payments;
  }

  useEffect(() => {
    const init = async () => {
      const start = getMonday(new Date());
      const end = getSunday(new Date());

      const r = await getWeekPayments({ start, end });
      console.log(r);

   
      const eventsr = setDataStateEvents(r);

      setEvents(eventsr);
      console.log("events:----------------------------->", eventsr);
    };

    init();

    return () => {};
  }, []);

  const handleDatesSet = async (info) => {
    // info.start y info.end son las fechas de inicio y fin del rango de la vista actual
    const startDate = info.start; // Fecha de inicio
    const endDate = info.end; // Fecha de fin
    endDate.setDate(endDate.getDate() - 1);
    console.log("startDate:----------------------------->",startDate)
    console.log("endDate:----------------------------->",endDate)

    // Convertir las fechas a formato 'YYYY-MM-DD'
    const startFormatted = startDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    const endFormatted = endDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'

    const r = await getWeekPayments({ start:startFormatted, end:endFormatted })

    console.log("r:----------------------------->",r)

    const eventsr = setDataStateEvents(r);

    setEvents(eventsr)

    /* const r = await paymentsModel.getWeeksPaymentsState("pending",[
        startFormatted,endFormatted ])

       

       setEvents(setDataStateEvents(r))
       */
  };


    const handleDateClick = (arg) => {
     // alert('Fecha seleccionada: ' + arg.dateStr);
    };
  const handleEventClick = async (clickInfo) => {
    const data = clickInfo.event.extendedProps;

    console.log("data:----------------------------->",data)
    if (
      confirm(
        `Deseas pagar el ${data.label} de ${data.name} monto ${data.monto} fecha ${data.payment_date}`
      )
    ) {
      const r = await payPayment(data.payment_id,data.loan_id);

      console.log("r:----------------------------->",r)

      setEvents((prev) =>
        prev.filter((p) => {
          if (p.payment_id != data.payment_id) return p;
        })
      );
    }
  };

  return (
    <>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]} // Usamos timeGridPlugin para la vista semanal
        initialView="timeGridWeek" // Configura la vista por defecto a la semana
        events={events} // Los eventos que se muestran en el calendario
        dateClick={handleDateClick} // Acción al hacer clic en una fecha
        eventClick={handleEventClick} // Acción al hacer clic en un evento
        locale={esLocale} // Configura el idioma en español
        datesSet={handleDatesSet}
      />
    </>
  );
};

export default Calendar;
