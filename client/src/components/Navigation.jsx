import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="nav-bar">
      <div className="nav-logo">TaskFlow</div>
      <div className="nav-menu">
        <Link 
          to="/dashboard" 
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/tasks" 
          className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`}
        >
          Tasks
        </Link>
      </div>
      <div className="nav-user">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navigation; 