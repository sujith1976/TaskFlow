import React, { useState, useEffect } from 'react';
import { FaPlus, FaCalendarAlt, FaClock, FaEdit, FaTrash } from 'react-icons/fa';
import './MeetingList.css';
import MeetingForm from './MeetingForm';
import axiosInstance from '../config/axios';

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axiosInstance.get('/meetings');
      setMeetings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError('Failed to fetch meetings');
      setLoading(false);
    }
  };

  const handleCreateMeeting = () => {
    setShowMeetingForm(true);
  };

  const handleMeetingSubmit = async (meetingData) => {
    try {
      await axiosInstance.post('/meetings', meetingData);
      setShowMeetingForm(false);
      fetchMeetings();
    } catch (error) {
      console.error('Error creating meeting:', error);
      setError('Failed to create meeting');
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await axiosInstance.delete(`/meetings/${meetingId}`);
      fetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
      setError('Failed to delete meeting');
    }
  };

  if (loading) {
    return <div className="loading">Loading meetings...</div>;
  }

  return (
    <div className="meetings-section">
      <div className="meetings-header">
        <h2>Meetings</h2>
        <button className="create-meeting-btn" onClick={handleCreateMeeting}>
          <FaPlus /> Create Meeting
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="meetings-grid">
        {meetings.map(meeting => (
          <div key={meeting._id} className="meeting-card">
            <h3 className="meeting-title">{meeting.title}</h3>
            <p className="meeting-description">{meeting.description}</p>
            
            <div className="meeting-meta">
              <span className="meeting-date">
                <FaCalendarAlt />
                {new Date(meeting.date).toLocaleDateString()}
              </span>
              <span className="meeting-time">
                <FaClock />
                {meeting.startTime} - {meeting.endTime}
              </span>
            </div>

            <div className="meeting-actions">
              <button 
                className="meeting-action-btn"
                onClick={() => handleEditMeeting(meeting._id)}
              >
                <FaEdit />
              </button>
              <button 
                className="meeting-action-btn delete-meeting-btn"
                onClick={() => handleDeleteMeeting(meeting._id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showMeetingForm && (
        <MeetingForm
          onClose={() => setShowMeetingForm(false)}
          onSubmit={handleMeetingSubmit}
        />
      )}
    </div>
  );
};

export default MeetingList;
