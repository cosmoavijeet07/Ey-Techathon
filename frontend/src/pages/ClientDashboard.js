import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ClientDashboard() {
  const [feedback, setFeedback] = useState("");
  const [language, setLanguage] = useState("en");
  const [error, setError] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [translatedText, setTranslatedText] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback) {
      setError("Please provide feedback.");
      return;
    }

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not authenticated.");
      return;
    }

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

  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen font-sans flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 md:px-20 py-6 fixed w-full top-0 z-50 backdrop-blur-lg bg-white/90 shadow-lg border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">OptiClaim</h1>
        <div className="hidden md:flex gap-10 items-center text-gray-800 text-lg">
          <button onClick={() => navigate("/call-management")} className="hover:text-yellow-500 transition-colors">📞 Call Management</button>
          <button onClick={() => navigate("/call-scheduling")} className="hover:text-yellow-500 transition-colors">📅 Call Scheduling</button>
          <button onClick={() => navigate("/priority-management")} className="hover:text-yellow-500 transition-colors">⚡ Priority Management</button>
          <button onClick={() => navigate("/sla-tracking")} className="hover:text-yellow-500 transition-colors">📊 SLA Tracking</button>
          <button className="px-8 py-3 rounded-full text-white bg-red-500 hover:bg-red-400 transition-all font-semibold shadow-lg"> Logout</button>
        </div>
      </nav>
      <br></br>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-6 md:px-20">
        <motion.div
          className="bg-gradient-to-r from-gray-100 to-gray-300 rounded-xl shadow-2xl p-8 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-8">📝 Client Feedback</h2>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Language Selection */}
            <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-900 mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
                <option value="gu">Gujarati</option>
              </select>
            </div>

            {/* Feedback Textarea */}
            <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-900 mb-2">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <center>
            <button
              type="submit"
              className="w-half px-6 py-3 rounded-full text-white bg-blue-600 hover:bg-blue-500 transition-all font-semibold shadow-md"
            >
              Submit Feedback
            </button>
            </center>
          </form>

          {/* Sentiment Analysis Result */}
          {sentiment !== null && (
            <motion.div
              className="mt-8 bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sentiment Analysis Result</h3>
              <p className="text-gray-800"><strong>Sentiment Score:</strong> {sentiment}</p>
              {translatedText && (
                <p className="text-gray-800"><strong>Translated Text:</strong> {translatedText}</p>
              )}
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center bg-black text-gray-300">
        <p>© 2025 OptiClaim by Roast and Toast</p>
      </footer>
    </div>
  );
}

export default ClientDashboard;