import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./ClientAnalysisDashboard.css"; // Import external CSS

function ClientAnalysisDashboard() {
  return (
    <div className="dashboard-wrapper">
      {/* Header with Dashboard Title */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Client Analysis Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Navigation links */}
        <div className="navigation-grid">
          <Link
            to="/sentiment-dashboard"
            className="glass-card navigation-link"
          >
            <h2 className="navigation-title">Sentiment Dashboard</h2>
            <p>View sentiment analysis of client interactions.</p>
          </Link>
          <Link
            to="/autoresponse"
            className="glass-card navigation-link"
          >
            <h2 className="navigation-title">AutoResponse</h2>
            <p>Automated Agent Responses.</p>
          </Link>
          <Link
            to="/escalation-management"
            className="glass-card navigation-link"
          >
            <h2 className="navigation-title">Escalation Management</h2>
            <p>Manage escalated calls and interactions.</p>
          </Link>
          <Link
            to="/analytics-overview"
            className="glass-card navigation-link"
          >
            <h2 className="navigation-title">Analytics Overview</h2>
            <p>View overall client interaction analytics.</p>
          </Link>
          <Link
            to="/agenttraining"
            className="glass-card navigation-link"
          >
            <h2 className="navigation-title">Agent Trainer</h2>
            <p>AI Based Agent Trainer.</p>
          </Link>
          <Link
            to="/emailreply"
            className="glass-card navigation-link"
          >
            <h2 className="navigation-title">Automated Email Response</h2>
            <p>Generate Automated Email Responses</p>
          </Link>
          <Link
            to="/feedbackanalysis"
            className="glass-card navigation-link"
          >
            <h2 className="navigation-title">Feedback Summarizer</h2>
            <p>Summarize client feedback based on issue categories</p>
          </Link>
          <Link
            to="/audio-analysis"
            className="glass-card navigation-link"
          >
            <h2 className="navigation-title">Audio Processing</h2>
            <p>Detect Sentiment and Emotions using call recordings and live streaming</p>
          </Link>
        </div>

        {/* Subpage content -- to be commented
        <div className="glass-card subpage-content">
          <Outlet />
        </div> */}
      </main>

      {/* Floating Navigation Bar */}
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
}

export default ClientAnalysisDashboard;