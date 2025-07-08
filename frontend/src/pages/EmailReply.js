import React, { useState } from "react";
import "./EmailReply.css"; // External CSS for professional styling

const EmailReply = () => {
  const [emailContent, setEmailContent] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateReply = async () => {
    if (!emailContent.trim()) {
      alert("Please enter the email content.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/email/generate-email-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailContent }),
      });

      const data = await response.json();
      setGeneratedReply(data.response);
    } catch (error) {
      console.error("Error generating reply:", error);
      alert("Failed to generate the reply.");
    }
    setLoading(false);
  };

  return (
    <div className={`email-reply-container ${generatedReply ? "split-layout" : ""}`}>
      {!generatedReply ? (
        <div className="full-container glass-card">
          <h2 className="dashboard-title">AI Email Reply Generator</h2>
          <div className="form-group">
            <label className="form-label">Enter Customer Email Content:</label>
            <textarea
              className="form-input form-textarea"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste the customer's email here..."
            ></textarea>
          </div>
          <button className="action-button submit-button" onClick={handleGenerateReply} disabled={loading}>
            {loading ? "Generating..." : "Generate Reply"}
          </button>
        </div>
      ) : (
        <div className="split-container">
          <div className="email-section glass-card">
            <h3 className="section-title">Customer's Email</h3>
            <p className="email-content">{emailContent}</p>
          </div>
          <div className="email-section glass-card">
            <h3 className="section-title">AI-Generated Reply</h3>
            <p className="email-content">{generatedReply}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailReply;
