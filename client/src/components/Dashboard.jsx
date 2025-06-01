import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaChartLine, FaCog, FaUserCircle, FaTasks,
  FaCheckCircle, FaClock, FaCalendar, FaArrowUp, FaArrowDown,
  FaPlus, FaTimes
} from 'react-icons/fa';
import './Dashboard.css';

const API_BASE_URL = 'http://localhost:5001/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('overview');
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo'
  });

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
      setError(error.response?.data?.message || 'Failed to fetch tasks');
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/tasks`, newTask, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTasks();
      setShowTaskForm(false);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'todo'
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create task');
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;

  // Group tasks by status
  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    inProgress: tasks.filter(task => task.status === 'in-progress'),
    completed: tasks.filter(task => task.status === 'completed')
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h1>TaskFlow</h1>
        </div>

        <div className="sidebar-menu">
          <button 
            className={`menu-item ${activeMenu === 'overview' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('overview');
              setShowTaskForm(false);
            }}
          >
            <FaChartLine /> Overview
          </button>
          <button 
            className={`menu-item ${activeMenu === 'tasks' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('tasks');
              setShowTaskForm(true);
            }}
          >
            <FaTasks /> Tasks
          </button>
          <button 
            className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('settings');
              setShowTaskForm(false);
            }}
          >
            <FaCog /> Settings
          </button>
          <button 
            className={`menu-item ${activeMenu === 'profile' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('profile');
              setShowTaskForm(false);
            }}
          >
            <FaUserCircle /> Profile
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        {showTaskForm ? (
          <div className="task-form-container">
            <div className="task-form-header">
              <h2>Create New Task</h2>
              <button className="close-button" onClick={() => setShowTaskForm(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleTaskSubmit} className="task-form">
              <div className="form-group">
                <label htmlFor="title">Task Title</label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                  placeholder="Enter task title"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  required
                  placeholder="Enter task description"
                  rows="4"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="datetime-local"
                    id="dueDate"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowTaskForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="dashboard-header">
              <div className="stat-card">
                <div className="stat-title">
                  <FaTasks /> Total Tasks
                </div>
                <div className="stat-value">{totalTasks}</div>
                <div className="stat-change positive">
                  <FaArrowUp /> 12% from last week
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-title">
                  <FaCheckCircle /> Completed
                </div>
                <div className="stat-value">{completedTasks}</div>
                <div className="stat-change positive">
                  <FaArrowUp /> 8% from last week
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-title">
                  <FaClock /> In Progress
                </div>
                <div className="stat-value">{inProgressTasks}</div>
                <div className="stat-change negative">
                  <FaArrowDown /> 5% from last week
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-title">
                  <FaCalendar /> To Do
                </div>
                <div className="stat-value">{todoTasks}</div>
                <div className="stat-change positive">
                  <FaArrowUp /> 2% from last week
                </div>
              </div>
            </div>

            <div className="tasks-grid">
              <div className="tasks-section">
                <div className="tasks-header">
                  <h2>To Do</h2>
                  <span className="tasks-count">{tasksByStatus.todo.length}</span>
                </div>
                <div className="tasks-list">
                  {tasksByStatus.todo.map(task => (
                    <div key={task._id} className="task-item">
                      <div className="task-title">{task.title}</div>
                      <div className="task-meta">
                        <span className={`task-priority priority-${task.priority}`}>
                          {task.priority}
                        </span>
                        <span className="task-status status-todo">
                          To Do
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tasks-section">
                <div className="tasks-header">
                  <h2>In Progress</h2>
                  <span className="tasks-count">{tasksByStatus.inProgress.length}</span>
                </div>
                <div className="tasks-list">
                  {tasksByStatus.inProgress.map(task => (
                    <div key={task._id} className="task-item">
                      <div className="task-title">{task.title}</div>
                      <div className="task-meta">
                        <span className={`task-priority priority-${task.priority}`}>
                          {task.priority}
                        </span>
                        <span className="task-status status-in-progress">
                          In Progress
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tasks-section">
                <div className="tasks-header">
                  <h2>Completed</h2>
                  <span className="tasks-count">{tasksByStatus.completed.length}</span>
                </div>
                <div className="tasks-list">
                  {tasksByStatus.completed.map(task => (
                    <div key={task._id} className="task-item">
                      <div className="task-title">{task.title}</div>
                      <div className="task-meta">
                        <span className={`task-priority priority-${task.priority}`}>
                          {task.priority}
                        </span>
                        <span className="task-status status-completed">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 