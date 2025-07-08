import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AutoResponse() {
  const [message, setMessage] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSuggestion = async () => {
    if (!message.trim()) return; // Prevent empty requests

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/auto_response/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (data.generated_response) {
        setSuggestion(data.generated_response); // Store response correctly
      } else {
        setSuggestion("No response generated.");
      }
    } catch (error) {
      console.error("Error fetching suggestion:", error);
      setSuggestion("Error generating response.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen font-sans flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 md:px-20 py-6 fixed w-full top-0 z-50 backdrop-blur-lg bg-white/90 shadow-lg border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">OptiClaim</h1>
        <div className="hidden md:flex gap-10 items-center text-gray-800 text-lg">
          <button onClick={() => navigate("/knowledge-base")} className="hover:text-yellow-500 transition-colors">Knowledge Base</button>
          <button onClick={() => navigate("/agenttraining")} className="hover:text-yellow-500 transition-colors">AI Agent Trainer</button>
          <button onClick={() => navigate("/feedbackanalysis")} className="hover:text-yellow-500 transition-colors">Claim Analyzer</button>
          <button className="px-8 py-3 rounded-full text-white bg-red-500 hover:bg-red-400 transition-all font-semibold shadow-lg">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-6 md:px-20">
        <motion.div
          className="bg-gradient-to-r from-gray-100 to-gray-300 rounded-xl shadow-2xl p-8 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-8">🤖 AI Driven Response Generation </h2>

          {/* Textarea for Input */}
          <textarea
            className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 placeholder-gray-400"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
          ></textarea>

          {/* Generate Response Button */}
          <center>
          <button
  className="w-1/2 mt-6 px-6 py-3 rounded-full text-white bg-blue-600 hover:bg-blue-500 transition-all font-semibold shadow-md"
  onClick={fetchSuggestion}
  disabled={loading}
>
  {loading ? "Generating..." : "Generate Response"}
</button>
</center>


          {/* Suggested Response */}
          {suggestion && (
            <motion.div
              className="mt-8 bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Suggested Response:</h3>
              <p className="text-gray-800">{suggestion}</p>
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

export default AutoResponse;