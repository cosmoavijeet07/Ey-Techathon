import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FormProcessing = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transcriptId, setTranscriptId] = useState("");
  const [formData, setFormData] = useState({
    name: "Unknown",
    age: "Unknown",
    sentiment: "Unknown",
    issue_summary: "Unknown",
    call_duration: "Unknown",
    agent_name: "Unknown",
  });
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessed, setIsProcessed] = useState(false);

  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/form_filling/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error processing transcript");
      }

      const data = await response.json();

      setTranscriptId(data.transcript_id);
      setFormData(data.extracted_info);
      setSuccess("Transcript processed successfully!");
      setIsProcessed(true);

      setChatHistory([{ role: "assistant", content: "Hello, I am your Call Transcript Assistant! Ask me anything about the transcript." }]);
    } catch (err) {
      setError(err.message || "Error processing transcript.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!transcriptId) return;
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/form_filling/form/${transcriptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error updating form");
      }
      setSuccess("Form updated successfully!");
    } catch (err) {
      setError(err.message || "Error updating form.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || !transcriptId) return;
    setChatHistory([...chatHistory, { role: "user", content: query }]);
    const currentQuery = query;
    setQuery("");
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/form_filling/query/${transcriptId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentQuery }),
      });
      if (!response.ok) {
        throw new Error("Error processing query");
      }
      const data = await response.json();
      setChatHistory((prevChat) => [...prevChat, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setError(err.message || "Error processing query.");
      setChatHistory((prevChat) => [...prevChat, { role: "assistant", content: "Sorry, I encountered an error processing your question." }]);
    }
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
          className="bg-gradient-to-r from-gray-100 to-gray-300 rounded-xl shadow-2xl p-8 w-full max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-8">📄 Call Transcript Analyzer & Q&A Bot</h2>

          {/* File Upload Section */}
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="px-6 py-3 rounded-full text-white bg-blue-600 hover:bg-blue-500 transition-all font-semibold shadow-md"
              >
                Browse Files
              </button>
              <span className="text-gray-800">{file ? file.name : "No file chosen"}</span>
            </div>
            <button
              onClick={handleFileUpload}
              disabled={!file || loading}
              className="px-6 py-3 rounded-full text-white bg-green-600 hover:bg-green-500 transition-all font-semibold shadow-md"
            >
              {loading ? "Processing..." : "Upload Transcript"}
            </button>
          </div>

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          {success && <p className="text-green-600 mb-4 text-center">{success}</p>}

          {/* Auto-Filled Form Section */}
          {isProcessed && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 Auto-Filled BPO Form</h3>
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(formData).map((key) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-lg font-semibold text-gray-900 mb-2">
                      {key.replace("_", " ")}
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleFormChange}
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="col-span-full px-6 py-3 rounded-full text-white bg-purple-600 hover:bg-purple-500 transition-all font-semibold shadow-md"
                >
                  {loading ? "Updating..." : "Update Form"}
                </button>
              </form>
            </div>
          )}

          {/* Chat Section */}
          {isProcessed && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">💬 Chat with Transcript Assistant</h3>
              <div
                className="bg-white rounded-xl shadow-lg p-6 h-[400px] overflow-y-auto flex flex-col gap-4 mb-6"
                ref={chatContainerRef}
              >
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-4 rounded-lg ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm font-medium">{msg.role === "user" ? "You" : "Assistant"}</p>
                      <p className="text-base">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleQuerySubmit} className="flex gap-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about the transcript..."
                  className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full text-white bg-yellow-500 hover:bg-yellow-400 transition-all font-semibold shadow-md"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center bg-black text-gray-300">
        <p>© 2025 OptiClaim by Roast and Toast</p>
      </footer>
    </div>
  );
};

export default FormProcessing;