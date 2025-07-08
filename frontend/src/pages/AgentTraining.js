import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const customerTypes = [
  { value: "angry", label: "😡 Angry Customer" },
  { value: "disappointed", label: "😞 Disappointed Customer" },
  { value: "happy", label: "😊 Happy Customer" },
  { value: "confused", label: "🤔 Confused Customer" },
];

const issueTypes = [
  { value: "claim_rejected", label: "Claim Rejected" },
  { value: "claim_delayed", label: "Claim Delayed" },
  { value: "missing_documents", label: "Missing Documents" },
  { value: "successful_claim", label: "Successful Claim" },
  { value: "claim_partially_approved", label: "Claim Partially Approved" },
  { value: "claim_escalation", label: "Claim Escalation" },
  { value: "incorrect_payout", label: "Incorrect Payout" },
  { value: "claim_cancellation", label: "Claim Cancellation" },
  { value: "policy_coverage_issue", label: "Policy Coverage Issue" },
  { value: "technical_error", label: "Technical Error" },
];

const AgentTraining = () => {
  const [selectedCustomerType, setSelectedCustomerType] = useState("");
  const [selectedIssueType, setSelectedIssueType] = useState("");
  const [conversation, setConversation] = useState([]);
  const [agentMessage, setAgentMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [agentScore, setAgentScore] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [milestoneMessage, setMilestoneMessage] = useState("");
  const navigate = useNavigate();

  // Milestones
  const milestones = [100, 300, 500, 1000];

  // Update progress and check for milestones
  const updateProgress = (score) => {
    const newTotalScore = totalScore + score;
    setTotalScore(newTotalScore);

    // Check for milestones
    for (const milestone of milestones) {
      if (newTotalScore >= milestone && !milestoneMessage.includes(milestone.toString())) {
        setMilestoneMessage(`Congratulations! You reached a milestone of ${milestone} points.`);
        break; // Stop after the first milestone reached
      }
    }
  };

  const sendMessage = async () => {
    if (!selectedCustomerType || !selectedIssueType || !agentMessage.trim()) {
      setError("Please select a customer type, issue type, and enter a message.");
      return;
    }

    const newConversation = [...conversation, { sender: "Agent", text: agentMessage }];
    setConversation(newConversation);
    setAgentMessage("");
    setLoading(true);
    setError("");
    setShowTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/agent_training/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_type: selectedCustomerType,
          issue_type: selectedIssueType,
          message: agentMessage,
          history: newConversation,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch AI response.");

      const data = await response.json();
      if (data.response) {
        setTimeout(() => {
          setConversation([...newConversation, { sender: "Customer", text: data.response }]);
          setAgentScore(data.rating);
          setShowTyping(false);

          // Update progress with the score
          const score = parseInt(data.rating.split(" ")[0]); // Extract score from rating
          if (!isNaN(score)) {
            updateProgress(score);
          }
        }, 1000);
      }
    } catch (error) {
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
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
      <br></br>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-6 md:px-20">
        <motion.div
          className="bg-gradient-to-r from-gray-100 to-gray-300 rounded-xl shadow-2xl p-8 w-full max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-8">🎓 My AI Driven Learning</h2>

          {/* Scenario Selection */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <select
              className="px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              value={selectedCustomerType}
              onChange={(e) => setSelectedCustomerType(e.target.value)}
            >
              <option value="">Select Customer Type...</option>
              {customerTypes.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              className="px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              value={selectedIssueType}
              onChange={(e) => setSelectedIssueType(e.target.value)}
            >
              <option value="">Select Issue Type...</option>
              {issueTypes.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 h-[400px] overflow-y-auto flex flex-col gap-4">
            {conversation.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "Agent" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-lg ${
                    msg.sender === "Agent"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm font-medium">{msg.sender}</p>
                  <p className="text-base">{msg.text}</p>
                </div>
              </div>
            ))}
            {showTyping && (
              <div className="flex justify-start">
                <div className="bg-yellow-100 text-gray-900 p-4 rounded-lg rounded-bl-none max-w-[70%]">
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-base">Typing...</p>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-4">
            <input
              type="text"
              value={agentMessage}
              onChange={(e) => setAgentMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-6 py-3 rounded-full text-white bg-blue-600 hover:bg-blue-500 transition-all font-semibold shadow-md"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>

          {/* Feedback Section */}
          <div className="mt-8">
            {agentScore && (
              <p className="text-xl font-bold text-gray-900">Performance Score: {agentScore}</p>
            )}
            {milestoneMessage && (
              <p className="mt-2 text-lg font-bold text-yellow-600">{milestoneMessage}</p>
            )}
            {error && <p className="mt-2 text-red-600">{error}</p>}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center bg-black text-gray-300">
        <p>© 2025 OptiClaim by Roast and Toast</p>
      </footer>
    </div>
  );
};

export default AgentTraining;