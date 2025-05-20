import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import 'react-calendar/dist/Calendar.css';

Modal.setAppElement('#root');  // Para evitar advertencias de accesibilidad.

const CalendarApp = ({onClick}) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventText, setEventText] = useState("");

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onClick(date);
    //setShowModal(true);
  };

  const handleEventSubmit = () => {
    if (eventText.trim()) {
      const eventDate = selectedDate.toDateString();
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        if (!updatedEvents[eventDate]) {
          updatedEvents[eventDate] = [];
        }
        updatedEvents[eventDate].push(eventText);
        return updatedEvents;
      });
      setEventText("");
      setShowModal(false);
    }
  };

  const formatEvents = (date) => {
    const dateStr = date.toDateString();
    return events[dateStr] || [];
  };

  return (
    <div className="font-satoshi">
      <style>
        {`
          .react-calendar {
            width: 100%;
            border: none;
            font-family: 'Satoshi', sans-serif;
            background: transparent;
            color: white;
          }
          .react-calendar__navigation {
            margin-bottom: 1em;
          }
          .react-calendar__navigation button {
            min-width: 44px;
            background: none;
            font-size: 16px;
            font-weight: 500;
            color: white;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
          }
          .react-calendar__month-view__weekdays {
            text-align: center;
            text-transform: uppercase;
            font-weight: 500;
            font-size: 0.75em;
            color: rgba(255, 255, 255, 0.7);
          }
          .react-calendar__month-view__weekdays__weekday {
            padding: 0.5em;
          }
          .react-calendar__month-view__weekdays__weekday abbr {
            text-decoration: none;
            color: rgba(255, 255, 255, 0.7);
          }
          .react-calendar__tile {
            padding: 10px 6.6667px;
            background: none;
            text-align: center;
            line-height: 16px;
            font-size: 14px;
            color: white;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
          }
          .react-calendar__tile--now {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
          }
          .react-calendar__tile--now:enabled:hover,
          .react-calendar__tile--now:enabled:focus {
            background: rgba(255, 255, 255, 0.2);
            color: white;
          }
          .react-calendar__tile--active {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
          }
          .react-calendar__tile--active:enabled:hover,
          .react-calendar__tile--active:enabled:focus {
            background: rgba(255, 255, 255, 0.2);
            color: white;
          }
          .react-calendar__month-view__days__day--neighboringMonth {
            color: rgba(255, 255, 255, 0.3);
          }
          .react-calendar__month-view__days__day--weekend {
            color: rgba(255, 255, 255, 0.7);
          }
          .react-calendar__month-view__days__day--weekend.react-calendar__month-view__days__day--neighboringMonth {
            color: rgba(255, 255, 255, 0.3);
          }
        `}
      </style>
      <Calendar
        onChange={setDate}
        value={date}
        onClickDay={handleDateClick}
        className="w-full"
      />
      
      <ul>
        {formatEvents(date).map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>

      {/* Modal para agregar eventos */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Agregar Evento"
      >
        <h2>Agregar Evento</h2>
        <textarea
          value={eventText}
          onChange={(e) => setEventText(e.target.value)}
          placeholder="Escribe el evento..."
        ></textarea>
        <button onClick={handleEventSubmit}>Agregar Evento</button>
        <button onClick={() => setShowModal(false)}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default CalendarApp;