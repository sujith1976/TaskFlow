import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaFlag } from 'react-icons/fa';
import TimePickerButton from './TimePickerButton';
import './TaskForm.css';

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (task: any) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSubmit }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    priority: 'medium'
  });

  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields are filled
    if (!task.title || !task.description || !task.date || !task.startTime || !task.endTime) {
      setError('Please fill in all fields');
      return;
    }

    // Validate time slots
    const startMinutes = timeToMinutes(task.startTime);
    const endMinutes = timeToMinutes(task.endTime);
    
    if (endMinutes <= startMinutes) {
      setError('End time must be after start time');
      return;
    }

    onSubmit(task);
    onClose();
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <div className="task-form-header">
          <h2>Create New Task</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              placeholder="Enter task description"
            />
          </div>

          <div className="schedule-section">
            <h3>Schedule</h3>
            <div className="schedule-grid">
              <div className="form-group date-group">
                <label htmlFor="date">
                  <span className="icon-label">
                    <FaCalendarAlt className="schedule-icon" />
                    Date
                  </span>
                </label>
                <input
                  type="date"
                  id="date"
                  value={task.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setTask({ ...task, date: e.target.value })}
                />
              </div>

              <div className="form-group priority-group">
                <label htmlFor="priority">
                  <span className="icon-label">
                    <FaFlag className="schedule-icon" />
                    Priority Level
                  </span>
                </label>
                <select
                  id="priority"
                  value={task.priority}
                  onChange={(e) => setTask({ ...task, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="time-group">
                <span className="icon-label">
                  <FaClock className="schedule-icon" />
                  Time
                </span>
                <div className="time-pickers">
                  <TimePickerButton
                    selectedTime={task.startTime}
                    onChange={(time) => setTask({ ...task, startTime: time })}
                    label="Start Time"
                  />
                  <TimePickerButton
                    selectedTime={task.endTime}
                    onChange={(time) => setTask({ ...task, endTime: time })}
                    label="End Time"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;