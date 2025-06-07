import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaTasks, FaBell, FaChartBar } from 'react-icons/fa';
import Task from './Task';
import Analytics from './Analytics';
import './TaskList.css';
import axiosInstance from '../config/axios';

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [activeMenu, setActiveMenu] = useState('tasks');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError('');      const response = await axiosInstance.get('/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.response?.data?.message || 'Failed to fetch tasks. Please try again.');
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      const response = await axiosInstance.get('/meetings');
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError('Failed to fetch meetings');
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    switch (menu) {
      case 'overview':
        navigate('/dashboard');
        break;
      case 'tasks':
        navigate('/tasks');
        break;
      case 'meetings':
        navigate('/meetings');
        break;
      case 'analytics':
        // Stay on the same page but show analytics view
        setActiveMenu('analytics');
        break;
      default:
        break;
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
        return tasks.filter(task => task.date === today);
      case 'upcoming':
        return tasks.filter(task => task.date > today);
      case 'past':
        return tasks.filter(task => task.date < today);
      default:
        return tasks;
    }
  };

  useEffect(() => {
    if (activeMenu === 'meetings') {
      fetchMeetings();
    }
  }, [activeMenu]);

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  // Group tasks by status
  const tasksByStatus = {
    todo: filterTasks(tasks).filter(task => task.status === 'todo'),
    inProgress: filterTasks(tasks).filter(task => task.status === 'in-progress'),
    completed: filterTasks(tasks).filter(task => task.status === 'completed')
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
            onClick={() => handleMenuClick('overview')}
          >
            <FaChartLine /> Overview
          </button>
          <button 
            className={`menu-item ${activeMenu === 'tasks' ? 'active' : ''}`}
            onClick={() => handleMenuClick('tasks')}
          >
            <FaTasks /> Tasks
          </button>
          <button 
            className={`menu-item ${activeMenu === 'meetings' ? 'active' : ''}`}
            onClick={() => handleMenuClick('meetings')}
          >
            <FaBell /> Meetings
          </button>
          <button 
            className={`menu-item ${activeMenu === 'analytics' ? 'active' : ''}`}
            onClick={() => handleMenuClick('analytics')}
          >
            <FaChartBar /> Analytics
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        {activeMenu === 'meetings' ? (
          <div className="meetings-section">
            <h2>Meetings</h2>
            {meetings.map(meeting => (
              <div key={meeting._id} className="meeting-card">
                <h3>{meeting.title}</h3>
                <p>{meeting.description}</p>
                <div className="meeting-meta">
                  <span><FaCalendarAlt /> {new Date(meeting.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : activeMenu === 'analytics' ? (
          <Analytics tasks={tasks} />
        ) : (
          <div className="tasks-header">
            <h2>Task Management</h2>
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
        )}

        <div className="task-status-columns">
          <div className="task-column">
            <h3>To Do</h3>
            {tasksByStatus.todo.map(task => (
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
            {tasksByStatus.inProgress.map(task => (
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
            {tasksByStatus.completed.map(task => (
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