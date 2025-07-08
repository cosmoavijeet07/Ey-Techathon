import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Client.css';

const Client = () => {
  const [feedback, setFeedback] = useState('');
  const [language, setLanguage] = useState('en');
  const [sentiment, setSentiment] = useState(null);
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted successfully!');
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const userId = "user123"; // Replace with actual user ID

    try {
      const response = await fetch("http://127.0.0.1:5000/api/feedback/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback, language, client_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setSentiment(data.sentiment_score);
        setTranslatedText(data.translated_text);
        alert("Feedback submitted successfully.");
        setFeedback("");
        setError(null);
      } else {
        const data = await response.json();
        setError(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("An error occurred while submitting your feedback. Please try again later.");
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Opticlaim</h1>
        <p className="dashboard-subtitle">Easy Process Everywhere Everytime</p>
      </header>

      {/* Main Content Section */}
      <main className="dashboard-main">
        <div className="glass-card form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" required />
            </div>
            <div className="form-group">
              <label htmlFor="policy">Policy Number</label>
              <input type="text" id="policy" name="policy" required />
            </div>
            <div className="form-group">
              <label htmlFor="incident">Incident Detail</label>
              <textarea id="incident" name="incident" rows="4" required></textarea>
            </div>
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>

        <div className="glass-card contact-section">
          <div className="login-section">
            <button className="login-button" onClick={handleLoginClick}>
              Opticlaim Official Login
            </button>
          </div>
          <div className="contact-options">
            <h3>Register on Call</h3>
            <p>+19134446459</p>
            <div className="social-links">
              <a href="https://wa.me/+19134446459" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <a href="mailto:support@opticlaim.com" target="_blank" rel="noopener noreferrer">
                Mail
              </a>
            </div>
          </div>
        </div>

        <div className="glass-card feedback-form">
          <h3>Feedback</h3>
          <form onSubmit={handleFeedbackSubmit}>
            <div className="form-group">
              <label htmlFor="feedback">Your Feedback</label>
              <textarea
                id="feedback"
                name="feedback"
                rows="4"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                name="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <button type="submit" className="submit-button">Submit Feedback</button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {sentiment !== null && (
            <div className="feedback-result">
              <p><strong>Sentiment Score:</strong> {sentiment}</p>
              {translatedText && <p><strong>Translated Text:</strong> {translatedText}</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Client;