import React, { useState } from "react";
import "./ContentManagement.css"; // Import the same external CSS

function ContentManagement() {
  const [articles, setArticles] = useState([
    { id: 1, title: "Article 1" },
    { id: 2, title: "Article 2" },
  ]);

  const handleAddArticle = () => {
    const newArticle = { id: articles.length + 1, title: `Article ${articles.length + 1}` };
    setArticles([...articles, newArticle]);
  };

  const handleDeleteArticle = (id) => {
    setArticles(articles.filter((article) => article.id !== id));
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Content Management</h1>
      </header>

      <main className="dashboard-main">
        <div className="glass-card">
          <button
            onClick={handleAddArticle}
            className="action-button"
          >
            Add Article
          </button>

          <ul className="content-list">
            {articles.map((article) => (
              <li key={article.id} className="glass-card content-item">
                <span className="content-title">{article.title}</span>
                <button
                  onClick={() => handleDeleteArticle(article.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default ContentManagement;