import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./DataProcessingDashboard.css"; // Import external CSS

function DataProcessingDashboard() {
  return (
    <div className="dashboard-wrapper">
      {/* Main content */}
      <div className="dashboard-main">
        {/* Page content */}
        <div className="dashboard-content">
          <h1 className="dashboard-title">Data Processing Dashboard</h1>

          {/* Navigation links */}
          <div className="stats-grid">
            <Link
              to="/document-upload"
              className="glass-card stat-card"
            >
              <h2 className="stat-title">Document Upload</h2>
              <p>Upload documents for processing.</p>
            </Link>
            <Link
              to="/form-processing"
              className="glass-card stat-card"
            >
              <h2 className="stat-title">Form Processing</h2>
              <p>Process forms for data extraction.</p>
            </Link>
            <Link
              to="/data-validation"
              className="glass-card stat-card"
            >
              <h2 className="stat-title">Data Validation</h2>
              <p>Ensure data accuracy and integrity.</p>
            </Link>
            <Link
              to="/batch-processing"
              className="glass-card stat-card"
            >
              <h2 className="stat-title">Batch Processing</h2>
              <p>Manage large batches of data processing.</p>
            </Link>
          </div>

          {/* Subpage content -- To be commented
          <div className="glass-card subpage-content">
            <Outlet />
          </div> */}
        </div>
      </div>

      {/* Floating Navigation Bar */}
      <nav className="floating-nav">
        <Link to="/document-upload" className="nav-link">
          Document Upload
        </Link>
        <Link to="/form-processing" className="nav-link">
          Form Processing
        </Link>
        <Link to="/data-validation" className="nav-link">
          Data Validation
        </Link>
        <Link to="/batch-processing" className="nav-link">
          Batch Processing
        </Link>
      </nav>
    </div>
  );
}

export default DataProcessingDashboard;