// CalendarViewer.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarViewer = ({ initialDate }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Asegúrate de que initialDate sea un objeto Date
  const date = initialDate ? new Date(initialDate) : new Date();

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {date.toLocaleDateString()}
      </button>

      {isOpen && (
        <div style={{ position: 'absolute', zIndex: 1000 }}>
          <DatePicker
            selected={date}
            onChange={() => {}}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default CalendarViewer;
