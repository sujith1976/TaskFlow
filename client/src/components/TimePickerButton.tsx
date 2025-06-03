import React, { useState } from 'react';
import { FaClock } from 'react-icons/fa';

interface TimePickerButtonProps {
  selectedTime: string;
  onChange: (time: string) => void;
  label: string;
}

const TimePickerButton: React.FC<TimePickerButtonProps> = ({ selectedTime, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  return (
    <div className="time-picker-container">
      <label className="time-picker-label">{label}</label>
      <button
        type="button"
        className="time-picker-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaClock className="clock-icon" />
        {selectedTime || 'Select Time'}
      </button>
      
      {isOpen && (
        <div className="time-options-container">
          <div className="time-options-grid">
            {generateTimeOptions().map((time) => (
              <button
                key={time}
                type="button"
                className={`time-option ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => {
                  onChange(time);
                  setIsOpen(false);
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePickerButton; 