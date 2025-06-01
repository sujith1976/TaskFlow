import React, { useState } from 'react';
import axios from 'axios';
import './Task.css';

const API_BASE_URL = 'http://localhost:5001/api';

const Task = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [error, setError] = useState('');

  const handleStatusChange = async (newStatus) => {
    try {
      setError('');
      const response = await axios.put(`${API_BASE_URL}/tasks/${task._id}`, {
        ...task,
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      onUpdate(response.data);
    } catch (error) {
      console.error('Error updating task status:', error);
      setError(error.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      const response = await axios.put(`${API_BASE_URL}/tasks/${task._id}`, 
        {
          title: editedTask.title,
          description: editedTask.description,
          dueDate: editedTask.dueDate,
          priority: editedTask.priority,
          status: editedTask.status
        }, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    try {
      setError('');
      await axios.delete(`${API_BASE_URL}/tasks/${task._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      onDelete(task._id);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className={`task-card priority-${task.priority}`}>
      {error && <div className="error-message">{error}</div>}
      {isEditing ? (
        <div className="task-edit-form">
          <div className="form-group">
            <label htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="task-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-description">Description</label>
            <textarea
              id="edit-description"
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="task-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-date">Due Date</label>
              <input
                id="edit-date"
                type="date"
                value={editedTask.dueDate?.split('T')[0]}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="task-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-priority">Priority</label>
              <select
                id="edit-priority"
                value={editedTask.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                className="task-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="task-edit-buttons">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="task-content">
          <div className="task-header">
            <h3>{task.title}</h3>
            <span className={`priority-badge priority-${task.priority}`}>
              {task.priority}
            </span>
          </div>
          
          <p>{task.description}</p>
          
          <div className="task-meta">
            <div className="scheduled-date">
              <span className="meta-label">Due:</span>
              <span className="meta-value">{formatDate(task.dueDate)}</span>
            </div>
            
            <div className="task-status">
              <span className="meta-label">Status:</span>
              <select 
                value={task.status} 
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`status-select status-${task.status}`}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="task-actions">
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
            <button onClick={handleDelete} className="delete-btn">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task; 