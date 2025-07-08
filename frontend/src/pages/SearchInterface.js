import React, { useState } from "react";
import "./SearchInterface.css"; // Import the same CSS file used in AgentDashboard

function SearchInterface() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    // Simulate an API call
    const mockResults = [
      { id: 1, title: "Article 1", snippet: "Details about Article 1..." },
      { id: 2, title: "Article 2", snippet: "Details about Article 2..." },
    ];
    setResults(mockResults); // Replace with real API integration
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Knowledge Base Search</h1>
      </header>

      <main className="dashboard-main">
        <div className="glass-card search-container">
          <div className="search-input-container">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for articles..."
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>

          <ul className="search-results">
            {results.map((result) => (
              <li key={result.id} className="result-item">
                <h3 className="result-title">{result.title}</h3>
                <p className="result-snippet">{result.snippet}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default SearchInterface;