import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task';
import './TaskList.css';

const API_BASE_URL = 'http://localhost:5001/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    status: 'todo'
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError('');
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.response?.data?.message || 'Failed to fetch tasks. Please try again.');
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await axios.post(`${API_BASE_URL}/tasks`, 
        {
          title: newTask.title,
          description: newTask.description,
          dueDate: newTask.dueDate,
          priority: newTask.priority,
          status: 'todo'
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setTasks([...tasks, response.data]);
      setNewTask({ 
        title: '', 
        description: '', 
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'medium',
        status: 'todo'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error.response?.data?.message || 'Failed to create task. Please try again.');
    }
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
  };

  const filterTasks = (tasks) => {
    if (filter === 'all') return tasks;
    const today = new Date().toISOString().split('T')[0];
    switch (filter) {
      case 'today':
        return tasks.filter(task => task.dueDate === today);
      case 'upcoming':
        return tasks.filter(task => task.dueDate > today);
      case 'past':
        return tasks.filter(task => task.dueDate < today);
      default:
        return tasks;
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-list-container">
      <div className="create-task-section">
        <h2>Create New Task</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleCreateTask} className="create-task-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
              className="task-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="task-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Due Date</label>
              <input
                id="date"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
                className="task-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="task-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <button type="submit" className="create-task-btn">Create Task</button>
        </form>
      </div>

      <div className="tasks-section">
        <div className="tasks-header">
          <h2>Your Tasks</h2>
          <div className="task-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </button>
            <button 
              className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
              onClick={() => setFilter('today')}
            >
              Today
            </button>
            <button 
              className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
              onClick={() => setFilter('past')}
            >
              Past
            </button>
          </div>
        </div>

        <div className="task-status-columns">
          <div className="task-column">
            <h3>To Do</h3>
            {filterTasks(tasks)
              .filter(task => task.status === 'todo')
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
            ))}
          </div>
          <div className="task-column">
            <h3>In Progress</h3>
            {filterTasks(tasks)
              .filter(task => task.status === 'in-progress')
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
            ))}
          </div>
          <div className="task-column">
            <h3>Completed</h3>
            {filterTasks(tasks)
              .filter(task => task.status === 'completed')
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList; 