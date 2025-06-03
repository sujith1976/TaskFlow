import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaUsers } from 'react-icons/fa';
import TimePickerButton from './TimePickerButton';
import './MeetingForm.css';

interface MeetingFormProps {
  onClose: () => void;
  onSubmit: (meeting: any) => void;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ onClose, onSubmit }) => {  const [meeting, setMeeting] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    attendees: '',
    location: '',
    meetingType: 'online',
    isInterview: false,
    interviewee: {
      name: '',
      email: '',
      phone: '',
      role: '',
      company: ''
    }
  });

  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');    // Validate all fields are filled
    if (!meeting.title || !meeting.description || !meeting.date || !meeting.startTime || !meeting.endTime) {
      setError('Please fill in all required fields');
      return;
    }

    if (meeting.meetingType === 'interview') {
      if (!meeting.interviewee.name || !meeting.interviewee.email || !meeting.interviewee.phone || !meeting.interviewee.role) {
        setError('Please fill in all required interviewee details');
        return;
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(meeting.interviewee.email)) {
        setError('Please enter a valid email address for the interviewee');
        return;
      }
      // Validate phone number (basic validation)
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(meeting.interviewee.phone)) {
        setError('Please enter a valid phone number');
        return;
      }
    } else if (!meeting.attendees) {
      setError('Please add at least one attendee');
      return;
    }

    // Validate time slots
    const startMinutes = timeToMinutes(meeting.startTime);
    const endMinutes = timeToMinutes(meeting.endTime);
    
    if (endMinutes <= startMinutes) {
      setError('End time must be after start time');
      return;
    }

    onSubmit(meeting);
    onClose();
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div className="meeting-form-overlay">
      <div className="meeting-form-container">
        <div className="meeting-form-header">
          <h2>Schedule New Meeting</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="meeting-form">
          <div className="form-group">
            <label htmlFor="title">Meeting Title*</label>
            <input
              type="text"
              id="title"
              value={meeting.title}
              onChange={(e) => setMeeting({ ...meeting, title: e.target.value })}
              placeholder="Enter meeting title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              value={meeting.description}
              onChange={(e) => setMeeting({ ...meeting, description: e.target.value })}
              placeholder="Enter meeting description and agenda"
            />
          </div>          <div className="schedule-section">
            <h3>Meeting Details</h3>
            <div className="schedule-grid">
              <div className="form-group meeting-type-group">
                <label htmlFor="meetingType">
                  <span className="icon-label">
                    <FaUsers className="schedule-icon" />
                    Meeting Type*
                  </span>
                </label>
                <select
                  id="meetingType"
                  value={meeting.meetingType}
                  onChange={(e) => setMeeting({ ...meeting, meetingType: e.target.value })}
                >
                  <option value="online">Online</option>
                  <option value="in-person">In Person</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="interview">Interview</option>
                </select>
              </div>

              <div className="form-group date-group">
                <label htmlFor="date">
                  <span className="icon-label">
                    <FaCalendarAlt className="schedule-icon" />
                    Date*
                  </span>
                </label>
                <input
                  type="date"
                  id="date"
                  value={meeting.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setMeeting({ ...meeting, date: e.target.value })}
                />
              </div>

              <div className="time-group">
                <span className="icon-label">
                  <FaClock className="schedule-icon" />
                  Time*
                </span>
                <div className="time-pickers">
                  <TimePickerButton
                    selectedTime={meeting.startTime}
                    onChange={(time) => setMeeting({ ...meeting, startTime: time })}
                    label="Start Time"
                  />
                  <TimePickerButton
                    selectedTime={meeting.endTime}
                    onChange={(time) => setMeeting({ ...meeting, endTime: time })}
                    label="End Time"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  value={meeting.location}
                  onChange={(e) => setMeeting({ ...meeting, location: e.target.value })}
                  placeholder={meeting.meetingType === 'online' ? "Enter meeting link" : "Enter meeting location"}
                />
              </div>

              {meeting.meetingType !== 'interview' && (
                <div className="form-group">
                  <label htmlFor="attendees">Attendees* (comma-separated emails)</label>
                  <input
                    type="text"
                    id="attendees"
                    value={meeting.attendees}
                    onChange={(e) => setMeeting({ ...meeting, attendees: e.target.value })}
                    placeholder="Enter attendee emails separated by commas"
                  />
                </div>
              )}
            </div>
          </div>

          {meeting.meetingType === 'interview' && (
            <div className="interview-section">
              <h3>Interviewee Details</h3>
              <div className="interview-grid">
                <div className="form-group">
                  <label htmlFor="intervieweeName">Full Name*</label>
                  <input
                    type="text"
                    id="intervieweeName"
                    value={meeting.interviewee.name}
                    onChange={(e) => setMeeting({
                      ...meeting,
                      interviewee: { ...meeting.interviewee, name: e.target.value }
                    })}
                    placeholder="Enter candidate's full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="intervieweeEmail">Email Address*</label>
                  <input
                    type="email"
                    id="intervieweeEmail"
                    value={meeting.interviewee.email}
                    onChange={(e) => setMeeting({
                      ...meeting,
                      interviewee: { ...meeting.interviewee, email: e.target.value }
                    })}
                    placeholder="Enter candidate's email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="intervieweePhone">Phone Number*</label>
                  <input
                    type="tel"
                    id="intervieweePhone"
                    value={meeting.interviewee.phone}
                    onChange={(e) => setMeeting({
                      ...meeting,
                      interviewee: { ...meeting.interviewee, phone: e.target.value }
                    })}
                    placeholder="Enter candidate's phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="intervieweeRole">Role Applied For*</label>
                  <input
                    type="text"
                    id="intervieweeRole"
                    value={meeting.interviewee.role}
                    onChange={(e) => setMeeting({
                      ...meeting,
                      interviewee: { ...meeting.interviewee, role: e.target.value }
                    })}
                    placeholder="Enter position/role"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="intervieweeCompany">Current Company</label>
                  <input
                    type="text"
                    id="intervieweeCompany"
                    value={meeting.interviewee.company}
                    onChange={(e) => setMeeting({
                      ...meeting,
                      interviewee: { ...meeting.interviewee, company: e.target.value }
                    })}
                    placeholder="Enter current company (optional)"
                  />
                </div>
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingForm;
