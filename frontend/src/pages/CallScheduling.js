import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function CallScheduling() {
  const [schedule, setSchedule] = useState({
    caller: "",
    phone: "",
    issue: "",
    description: "",
    agent: "",
  });

  const navigate = useNavigate();

  // Predefined issue types for dropdown
  const issueTypes = [
    "Fraud",
    "Urgent Claim",
    "Technical Issue",
    "Claim Status Update",
    "Payment Issue",
    "General Inquiry",
    "Policy Update",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/call-queue/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caller_name: schedule.caller,
          caller_phone: schedule.phone,
          issue_type: schedule.issue,
          issue_description: schedule.description,
          assigned_agent: schedule.agent,
          status: "pending",
        }),
      });

      if (response.ok) {
        alert("Call scheduled successfully!");
        setSchedule({ caller: "", phone: "", issue: "", description: "", agent: "" });
      } else {
        alert("Failed to schedule call.");
      }
    } catch (error) {
      console.error("Error scheduling call:", error);
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
          <h2 className="text-4xl font-bold text-gray-900 mb-8">📅 Call Scheduling</h2>

          {/* Scheduling Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Caller Name */}
            <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-900 mb-2">Caller Name</label>
              <input
                type="text"
                value={schedule.caller}
                onChange={(e) => setSchedule({ ...schedule, caller: e.target.value })}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Caller Phone */}
            <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-900 mb-2">Caller Phone</label>
              <input
                type="text"
                value={schedule.phone}
                onChange={(e) => setSchedule({ ...schedule, phone: e.target.value })}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Issue Type */}
            <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-900 mb-2">Issue Type</label>
              <select
                value={schedule.issue}
                onChange={(e) => setSchedule({ ...schedule, issue: e.target.value })}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select an Issue Type</option>
                {issueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Description */}
            <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-900 mb-2">Issue Description</label>
              <textarea
                value={schedule.description}
                onChange={(e) => setSchedule({ ...schedule, description: e.target.value })}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              ></textarea>
            </div>

            {/* Assign to Agent */}
            <div className="flex flex-col">
              <label className="text-lg font-medium text-gray-900 mb-2">Assign to Agent</label>
              <input
                type="text"
                value={schedule.agent}
                onChange={(e) => setSchedule({ ...schedule, agent: e.target.value })}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <center>
            <button
              type="submit"
              className="w-half px-6 py-3 rounded-full text-white bg-blue-600 hover:bg-blue-500 transition-all font-semibold shadow-md"
            >
              Schedule Call
            </button>
            </center>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center bg-black text-gray-300">
        <p>© 2025 OptiClaim by Roast and Toast</p>
      </footer>
    </div>
  );
}

export default CallScheduling;