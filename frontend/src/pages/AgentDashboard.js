import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./AgentDashboard.css"; // Import external CSS

const AgentDashboard = () => {
  const handleDeploy_1 = () => {
    window.open("https://doc-question-answer.streamlit.app/", "_blank");
  };

  const handleDeploy_2 = () => {
    window.open("https://form-analyser-1.streamlit.app/", "_blank");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header with Dashboard Title */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Agent Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Agent Info Card */}
        <div className="glass-card agent-info">
          <p className="welcome-text">
            Welcome, <span className="agent-name">Sundaresh</span>
          </p>
          <p className="calls-today">
            Calls Today: <span className="calls-count">23</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Pending Tasks */}
          <div className="glass-card stat-card">
            <h2 className="stat-title">Pending Tasks</h2>
            <p className="stat-value">15</p>
          </div>

          {/* Resolved Issues */}
          <div className="glass-card stat-card">
            <h2 className="stat-title">Resolved Issues</h2>
            <p className="stat-value">120</p>
          </div>

          {/* Escalated Calls */}
          <div className="glass-card stat-card">
            <h2 className="stat-title">Escalated Calls</h2>
            <p className="stat-value">5</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-grid">
          <button onClick={handleDeploy_1} className="glass-card action-button">
            Document-Based QnA Bot
          </button>
          <button onClick={handleDeploy_2} className="glass-card action-button">
            Automated Form Filling
          </button>
        </div>
      </main>

      {/* Floating Navigation */}
      <nav className="floating-nav">
        <Link to="/call-management" className="nav-link">
          Call Management
        </Link>
        <Link to="/knowledge-base" className="nav-link">
          Knowledge Base
        </Link>
        <Link to="/client-analysis" className="nav-link">
          Client Analysis
        </Link>
        <Link to="/data-processing" className="nav-link">
          Data Processing
        </Link>
      </nav>
    </div>
  );
};

export default AgentDashboard;