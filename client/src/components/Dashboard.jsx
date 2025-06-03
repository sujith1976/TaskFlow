import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaChartLine, FaCog, FaUserCircle, FaPlus,
  FaEdit, FaTrash, FaTasks, FaVideo,
  FaBell, FaSearch, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import './Dashboard.css';
import MeetingForm from './MeetingForm';

const API_BASE_URL = 'http://localhost:5001/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('overview');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');

  useEffect(() => {
    if (activeMenu === 'meetings') {
      fetchMeetings();
    } else {
      fetchTasks();
    }
  }, [activeMenu]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      
      // Show button when page is scrolled more than 300px
      setShowScrollButton(scrollY > 300);
      
      // Determine scroll direction based on position
      setScrollDirection(scrollY > pageHeight - viewportHeight - 100 ? 'up' : 'down');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const fetchMeetings = async () => {
    try {
      setError('');
      const response = await axios.get(`${API_BASE_URL}/meetings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMeetings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError(error.response?.data?.message || 'Failed to fetch meetings');
      setLoading(false);
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu === 'tasks') {
      navigate('/tasks/new');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleEditTask = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status');
    }
  };

  const handleMeetingSubmit = async (meetingData) => {
    try {
      await axios.post(`${API_BASE_URL}/meetings`, meetingData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShowMeetingForm(false);
      fetchMeetings();
    } catch (error) {
      console.error('Error creating meeting:', error);
      setError('Failed to create meeting');
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await axios.delete(`${API_BASE_URL}/meetings/${meetingId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
      setError('Failed to delete meeting');
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    inProgress: filteredTasks.filter(task => task.status === 'in-progress'),
    completed: filteredTasks.filter(task => task.status === 'completed')
  };

  const renderMeetings = () => {
    if (meetings.length === 0) {
      return (
        <div className="no-meetings">
          <p>No meetings scheduled</p>
          <button className="create-meeting-btn" onClick={() => setShowMeetingForm(true)}>
            <FaPlus /> Schedule Meeting
          </button>
        </div>
      );
    }

    return (
      <div className="meetings-container">
        <div className="meetings-header">
          <h2>Scheduled Meetings</h2>
          <button className="create-meeting-btn" onClick={() => setShowMeetingForm(true)}>
            <FaPlus /> Schedule Meeting
          </button>
        </div>
        <div className="meetings-grid">
          {meetings.map(meeting => (
            <div key={meeting._id} className="meeting-card">
              <div className="meeting-type-badge">
                <FaVideo /> {meeting.meetingType}
              </div>
              <h3>{meeting.title}</h3>
              <p>{meeting.description}</p>
              <div className="meeting-meta">
                <div className="meeting-datetime">
                  <FaCalendarAlt /> 
                  {new Date(meeting.date).toLocaleDateString()} 
                  <span className="meeting-time">
                    {meeting.startTime} - {meeting.endTime}
                  </span>
                </div>
                <div className="meeting-location">
                  {meeting.location || 'No location specified'}
                </div>
              </div>
              <div className="meeting-attendees">
                <strong>Attendees:</strong>
                <div className="attendee-list">
                  {meeting.attendees.join(', ')}
                </div>
              </div>
              <div className="meeting-actions">
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteMeeting(meeting._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const scrollToPosition = (direction) => {
    window.scrollTo({
      top: direction === 'up' ? 0 : document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

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
          <button            className={`menu-item ${activeMenu === 'meetings' ? 'active' : ''}`}
            onClick={() => handleMenuClick('meetings')}
          >
            <FaBell /> Meetings
          </button>
          <button 
            className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`}
            onClick={() => handleMenuClick('settings')}
          >
            <FaCog /> Settings
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="header-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="create-task-btn" onClick={() => navigate('/tasks/new')}>
            <FaPlus /> Create Task
          </button>
          <div className="user-profile">
            <FaUserCircle />
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="stat-value">{tasks.length}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-value">{tasksByStatus.inProgress.length}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value">{tasksByStatus.completed.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-value">{tasksByStatus.todo.length}</p>
          </div>
        </div>

        {activeMenu === 'meetings' ? (
          renderMeetings()
        ) : (
          <div className="task-board">
            <div className="board-column">
              <div className="column-header todo-header">
                <h2>To Do</h2>
                <span className="task-count">{tasksByStatus.todo.length}</span>
              </div>
              <div className="task-list">
                {tasksByStatus.todo.map(task => (
                  <div key={task._id} className="task-box">
                    <div className="task-priority-indicator" data-priority={task.priority} />
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span className="task-date">
                        <FaCalendarAlt /> {new Date(task.date).toLocaleDateString()}
                      </span>
                      <span className={`priority-tag priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="task-actions">
                      <button 
                        className="status-btn"
                        onClick={() => handleStatusChange(task._id, 'in-progress')}
                      >
                        Start
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditTask(task._id)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="board-column">
              <div className="column-header in-progress-header">
                <h2>In Progress</h2>
                <span className="task-count">{tasksByStatus.inProgress.length}</span>
              </div>
              <div className="task-list">
                {tasksByStatus.inProgress.map(task => (
                  <div key={task._id} className="task-box">
                    <div className="task-priority-indicator" data-priority={task.priority} />
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span className="task-date">
                        <FaCalendarAlt /> {new Date(task.date).toLocaleDateString()}
                      </span>
                      <span className={`priority-tag priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="task-actions">
                      <button 
                        className="status-btn"
                        onClick={() => handleStatusChange(task._id, 'completed')}
                      >
                        Complete
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditTask(task._id)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="board-column">
              <div className="column-header completed-header">
                <h2>Completed</h2>
                <span className="task-count">{tasksByStatus.completed.length}</span>
              </div>
              <div className="task-list">
                {tasksByStatus.completed.map(task => (
                  <div key={task._id} className="task-box">
                    <div className="task-priority-indicator" data-priority={task.priority} />
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span className="task-date">
                        <FaCalendarAlt /> {new Date(task.date).toLocaleDateString()}
                      </span>
                      <span className={`priority-tag priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="task-actions">
                      <button 
                        className="status-btn"
                        onClick={() => handleStatusChange(task._id, 'todo')}
                      >
                        Reopen
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditTask(task._id)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showMeetingForm && (
        <MeetingForm
          onClose={() => setShowMeetingForm(false)}
          onSubmit={handleMeetingSubmit}
        />
      )}

      <div className="scroll-nav-wrapper">
        <button 
          className={`scroll-nav-button ${showScrollButton ? 'show' : ''}`}
          onClick={() => scrollToPosition(scrollDirection)}
          aria-label={`Scroll to ${scrollDirection === 'up' ? 'top' : 'bottom'}`}
        >
          {scrollDirection === 'up' ? <FaArrowUp /> : <FaArrowDown />}
        </button>
        <div className="scroll-nav-label">
          {scrollDirection === 'up' ? 'Back to top' : 'Go to bottom'}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;