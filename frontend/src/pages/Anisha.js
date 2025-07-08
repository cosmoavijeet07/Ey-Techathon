import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Anisha.css';

const Anisha = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="header">
        <div className="header-left">
          <span className="opticlaim">Opticlaim</span>
          <span className="anisha">Anisha</span>
        </div>
        <div className="header-right">
          <button
            className="header-button"
            onClick={() => handleNavigation('/ai-call-tracker')}
          >
            Call Tracking
          </button>
          <button
            className="header-button"
            onClick={() => handleNavigation('/ai-email-tracking')}
          >
            Email Tracking
          </button>
          <button
            className="header-button"
            onClick={() => handleNavigation('/ai-whatsapp-tracking')}
          >
            WhatsApp Tracking
          </button>
          <button
            className="header-button"
            onClick={() => handleNavigation('/outbound')}
          >
            Schedule Call
          </button>
        </div>
      </header>

      {/* Dashboard Embed */}
      <div className="dashboard-embed">
        <iframe
          width="600"
          height="450"
          src="https://lookerstudio.google.com/embed/reporting/bd74bf8a-992e-4487-bcc0-bf362145bd44/page/xoZ8E"
          frameborder="0"
          style={{ border: 1 }}
          allowfullscreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
      </div>
    </div>
  );
};

export default Anisha;