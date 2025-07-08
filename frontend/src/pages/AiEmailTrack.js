import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AiEmailTrack.css';

const AIEmailTracker = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="email-tracker-container">
      {/* Header Section */}
      <header className="header">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <h1 className="page-title">Opticlaim - Anisha Email Track</h1>
      </header>

      {/* Google Sheets Embed */}
      <div className="sheet-embed">
        <iframe
          src="https://docs.google.com/spreadsheets/d/1t7bWTsLa5UvmOLDLAFCHpsJ30D_v1ieB3cJWhvqU57o/edit?usp=sharing"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Email Tracker Sheet"
        ></iframe>
      </div>
    </div>
  );
};

export default AIEmailTracker;