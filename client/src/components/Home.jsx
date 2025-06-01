import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun, FaTasks, FaCalendar, FaChartLine, FaUsers, FaCheckCircle, FaClock, FaShieldAlt, FaStream, FaBars, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show button when page is scrolled more than 300px
      setShowScrollButton(currentScrollY > 300);
      
      // Determine scroll direction
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToPosition = (position) => {
    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    document.body.style.overflow = isNavOpen ? 'auto' : 'hidden';
  };

  const features = [
    {
      icon: <FaTasks />,
      title: "Smart Task Organization",
      description: "Efficiently organize and prioritize your tasks with our intuitive Kanban board system"
    },
    {
      icon: <FaCalendar />,
      title: "Time Management",
      description: "Schedule and track tasks with our powerful calendar integration"
    },
    {
      icon: <FaChartLine />,
      title: "Progress Analytics",
      description: "Get detailed insights into your productivity and team performance"
    }
  ];

  const benefits = [
    {
      icon: <FaCheckCircle />,
      title: "Enhanced Productivity",
      description: "Boost your team's efficiency with streamlined task management"
    },
    {
      icon: <FaClock />,
      title: "Time Efficiency",
      description: "Save hours with automated task tracking and reminders"
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security"
    }
  ];

  return (
    <div className={`home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <nav className="main-nav">
        <div className="nav-left">
          <div className="logo">
            <FaStream className="logo-icon" />
            <span>TaskFlow</span>
          </div>
          <div className={`nav-links ${isNavOpen ? 'nav-active' : ''}`}>
            <a href="#features" onClick={() => setIsNavOpen(false)}>Features</a>
            <a href="#benefits" onClick={() => setIsNavOpen(false)}>Benefits</a>
            <a href="#pricing" onClick={() => setIsNavOpen(false)}>Pricing</a>
          </div>
        </div>
        <div className="nav-right">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <Link to="/login" className="nav-button">Login</Link>
          <Link to="/signup" className="nav-button primary">Get Started</Link>
          <button className="nav-toggle" onClick={toggleNav}>
            {isNavOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      <div className={`mobile-nav ${isNavOpen ? 'show' : ''}`}>
        <div className="mobile-nav-links">
          <a href="#features" onClick={() => setIsNavOpen(false)}>Features</a>
          <a href="#benefits" onClick={() => setIsNavOpen(false)}>Benefits</a>
          <a href="#pricing" onClick={() => setIsNavOpen(false)}>Pricing</a>
          <div className="mobile-nav-buttons">
            <Link to="/login" className="nav-button" onClick={() => setIsNavOpen(false)}>Login</Link>
            <Link to="/signup" className="nav-button primary" onClick={() => setIsNavOpen(false)}>Get Started</Link>
          </div>
        </div>
      </div>

      <section className="hero-section">
        <div className="hero-content">
          <h1>
            <span className="gradient-text">Streamline Your Tasks,</span>
            <br />
            Boost Productivity
          </h1>
          <p>Transform your workflow with TaskFlow's powerful task management platform. Stay organized, meet deadlines, and achieve more together.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="cta-button">Start Free Trial</Link>
            <a href="#demo" className="demo-button">
              <span className="play-icon">▶</span>
              Watch Demo
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Tasks Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src="/task-management.svg" alt="Task Management" className="floating-image" />
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Why Choose TaskFlow?</h2>
          <p>Experience the power of intelligent task management</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="benefits" className="benefits-section">
        <div className="section-header">
          <h2>Benefits</h2>
          <p>Unlock your team's full potential</p>
        </div>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Workflow?</h2>
          <p>Join thousands of teams already using TaskFlow to boost their productivity</p>
          <Link to="/signup" className="cta-button">Get Started Free</Link>
        </div>
      </section>

      <div className="scroll-nav-wrapper">
        <button 
          className={`scroll-nav-button ${showScrollButton ? 'show' : ''}`}
          onClick={() => scrollToPosition(scrollDirection === 'up' ? 0 : document.body.scrollHeight)}
          aria-label={`Scroll to ${scrollDirection === 'up' ? 'top' : 'bottom'}`}
        >
          {scrollDirection === 'up' ? <FaArrowUp /> : <FaArrowDown />}
        </button>
        <div className="scroll-nav-label">
          {scrollDirection === 'up' ? 'Back to top' : 'Go to bottom'}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>TaskFlow</h3>
            <p>Your ultimate task management solution</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#benefits">Benefits</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#careers">Careers</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <a href="#blog">Blog</a>
            <a href="#help">Help Center</a>
            <a href="#status">Status</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 