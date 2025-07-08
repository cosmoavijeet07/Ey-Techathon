import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AiWATracker.css';

const AIWhatsAppTracker = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="whatsapp-tracker-container">
      {/* Header Section */}
      <header className="header">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <h1 className="page-title">Opticlaim - Anisha WhatsApp Track</h1>
      </header>

      {/* Google Sheets Embed */}
      <div className="sheet-embed">
        <iframe
          src="https://docs.google.com/spreadsheets/d/1w9cXlJKRWeii-HCrKC7PNtbea6Owa4OfxdNEgBSkULI/edit?usp=sharing"
          width="100%"
          height="100%"
          frameBorder="0"
          title="WhatsApp Tracker Sheet"
        ></iframe>
      </div>
    </div>
  );
};

export default AIWhatsAppTracker;