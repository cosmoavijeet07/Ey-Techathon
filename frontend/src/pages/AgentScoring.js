import React, { useState } from "react";
import "./AgentScoring.css"; // External styling

const AgentScoring = () => {
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeResponse = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/agent_scoring/scoring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message, agent_id: "123" }),
      });

      const data = await response.json();
      setScore(data.score);
      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Error analyzing response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agent-scoring-container glass-card">
      <h2 className="scoring-title">🎯 Agent Performance Scoring</h2>

      {/* Input Message */}
      <textarea
        className="input-box"
        placeholder="Type your response..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button className="analyze-button" onClick={analyzeResponse} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Response"}
      </button>

      {/* Display Score & Analysis */}
      {score !== null && (
        <div className="score-section">
          <h3>Performance Score: {score}/100</h3>
          <div className="progress-bar">
            <div style={{ width: `${score}%` }} className="progress-fill"></div>
          </div>

          <div className="analysis-box">
            <p><strong>Sentiment:</strong> {analysis?.sentiment}</p>
            <p><strong>Empathy Level:</strong> {analysis?.empathy}</p>
            <p><strong>Clarity Score:</strong> {analysis?.clarity}/10</p>
            <p><strong>Issue Resolved:</strong> {analysis?.resolution}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentScoring;
