import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaTimes, FaCalendarAlt, FaClock, 
  FaExclamationCircle, FaAlignLeft, FaChevronLeft 
} from 'react-icons/fa';
import axiosInstance from '../config/axios';
import './TaskForm.css';

const TaskForm = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [task, setTask] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    priority: 'medium',
    status: 'todo'
  });

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/tasks/${taskId}`);
      setTask(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching task:', error);
      setError('Failed to fetch task details');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Validate all fields are filled
      if (!task.title?.trim()) {
        setError('Please enter a task title');
        return;
      }
      if (!task.description?.trim()) {
        setError('Please enter a task description');
        return;
      }
      if (!task.date || !task.startTime || !task.endTime) {
        setError('Please set the date and time for the task');
        return;
      }

      // Convert times to proper ISO format
      const startDateTime = new Date(`${task.date}T${task.startTime}`);
      const endDateTime = new Date(`${task.date}T${task.endTime}`);
      
      if (endDateTime <= startDateTime) {
        setError('End time must be after start time');
        return;
      }

      const taskData = {
        ...task,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      };

      if (taskId) {
        // Update existing task
        const response = await axiosInstance.put(`/tasks/${taskId}`, taskData);
        if (response.data) {
          navigate('/dashboard');
        }
      } else {
        // Create new task
        const response = await axiosInstance.post('/tasks', taskData);
        if (response.data) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error saving task:', error);
      let errorMessage = 'Failed to save task. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid task data. Please check all fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      }
      
      setError(errorMessage);
    }
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  if (loading) {
    return <div className="loading">Loading task details...</div>;
  }

  return (
    <div className="task-form-page">
      <div className="task-form-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          <FaChevronLeft /> Back to Dashboard
        </button>
        <h1>{taskId ? 'Edit Task' : 'Create New Task'}</h1>
      </div>

      <div className="task-form-container">
        <div className="task-form-content">
          <form onSubmit={handleSubmit} className="task-form">
            {error && <div className="error-message"><FaExclamationCircle /> {error}</div>}

            <div className="form-section">
              <h2>Basic Information</h2>
              <div className="form-group">
                <label htmlFor="title">
                  <span>Task Title</span>
                  <small>Give your task a clear and descriptive title</small>
                </label>
                <input
                  type="text"
                  id="title"
                  value={task.title}
                  onChange={(e) => setTask({ ...task, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  <span>Description</span>
                  <small>Provide detailed information about the task</small>
                </label>
                <textarea
                  id="description"
                  value={task.description}
                  onChange={(e) => setTask({ ...task, description: e.target.value })}
                  placeholder="Enter task description"
                  rows="4"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Schedule</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">
                    <span>Date</span>
                    <small>When is this task due?</small>
                  </label>
                  <div className="input-with-icon">
                    <FaCalendarAlt />
                    <input
                      type="date"
                      id="date"
                      value={task.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setTask({ ...task, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">
                    <span>Priority Level</span>
                    <small>How urgent is this task?</small>
                  </label>
                  <div className="input-with-icon">
                    <FaExclamationCircle />
                    <select
                      id="priority"
                      value={task.priority}
                      onChange={(e) => setTask({ ...task, priority: e.target.value })}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startTime">
                    <span>Start Time</span>
                    <small>When does the task begin?</small>
                  </label>
                  <div className="input-with-icon">
                    <FaClock />
                    <input
                      type="time"
                      id="startTime"
                      value={task.startTime}
                      onChange={(e) => setTask({ ...task, startTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="endTime">
                    <span>End Time</span>
                    <small>When should the task be completed?</small>
                  </label>
                  <div className="input-with-icon">
                    <FaClock />
                    <input
                      type="time"
                      id="endTime"
                      value={task.endTime}
                      onChange={(e) => setTask({ ...task, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="submit-button">
                {taskId ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>

          <div className="form-sidebar">
            <div className="sidebar-section">
              <h3>Tips</h3>
              <ul>
                <li>Be specific with your task title for better organization</li>
                <li>Set realistic time frames to ensure completion</li>
                <li>Add detailed descriptions to help you remember important details</li>
                <li>Use priority levels to manage your workload effectively</li>
                <li>Break down complex tasks into smaller, manageable sub-tasks</li>
              </ul>
            </div>

            <div className="sidebar-section">
              <h3>Priority Guide</h3>
              <div className="priority-guide">
                <div className="priority-item">
                  <span className="priority-dot high"></span>
                  <span>High - Urgent tasks that need immediate attention</span>
                </div>
                <div className="priority-item">
                  <span className="priority-dot medium"></span>
                  <span>Medium - Important but not urgent tasks</span>
                </div>
                <div className="priority-item">
                  <span className="priority-dot low"></span>
                  <span>Low - Tasks that can be done when time permits</span>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Best Practices</h3>
              <ul>
                <li>Review and update task status regularly</li>
                <li>Schedule breaks between tasks</li>
                <li>Set clear goals and milestones</li>
                <li>Keep task descriptions concise but informative</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;