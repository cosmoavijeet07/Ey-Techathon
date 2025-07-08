import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AiCallTracker.css';

const CallTracker = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleScheduleCall = () => {
    navigate('/outbound'); // Navigate to the schedule call page
  };

  return (
    <div className="call-tracker-container">
      {/* Header Section */}
      <header className="header">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <h1 className="page-title">Opticlaim: Anisha - Call Tracker</h1>
        <button className="schedule-call-button" onClick={handleScheduleCall}>
          Schedule Call
        </button>
      </header>

      {/* Google Sheets Embed */}
      <div className="sheet-embed">
        <iframe
          src="https://docs.google.com/spreadsheets/d/1nOI7rz_hD3sRA8to4DD7z5ie1UZRAuMRZIzmn1u_e2E/edit?usp=sharing"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Call Tracker Sheet"
        ></iframe>
      </div>
    </div>
  );
};

export default CallTracker;