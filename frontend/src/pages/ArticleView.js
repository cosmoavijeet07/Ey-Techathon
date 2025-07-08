import React, { useState } from "react";
import "./ArticleView.css"; // Import the same CSS file for consistency

function ArticleView() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    if (!question) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/api/knowledge/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error("Error fetching answer:", error);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Smart Knowledge Base</h1>
      </header>

      <main className="dashboard-main">
        <div className="glass-card knowledge-container">
          <h2 className="knowledge-title">Ask a Question</h2>
          <div className="input-group">
            <input
              type="text"
              className="glass-input"
              placeholder="Enter your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <button className="knowledge-button" onClick={handleAsk}>
            Ask
          </button>
          {answer && (
            <div className="answer-container">
              <h3 className="answer-title">Answer</h3>
              <p className="answer-text">{answer}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ArticleView;