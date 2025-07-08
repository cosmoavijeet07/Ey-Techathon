import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function PriorityManagement() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPriorityQueue();
  }, []);

  const fetchPriorityQueue = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/priority-management/get-priority-queue");
      const data = await response.json();
      setCalls(data);
    } catch (error) {
      console.error("Error fetching priority queue:", error);
    }
    setLoading(false);
  };

  const updatePriorities = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/priority-management/update-priorities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        alert("Priorities updated successfully!");
        fetchPriorityQueue(); // Refresh the list after updating
      } else {
        alert("Failed to update priorities.");
      }
    } catch (error) {
      console.error("Error updating priorities:", error);
    }
    setLoading(false);
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
          <h2 className="text-4xl font-bold text-gray-900 mb-8">⚡ Priority Management</h2>

          {/* Update Priorities Button */}
          <button
            onClick={updatePriorities}
            className="w-full px-6 py-3 rounded-full text-white bg-blue-600 hover:bg-blue-500 transition-all font-semibold shadow-md mb-8"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Priorities"}
          </button>

          {/* Calls List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {calls.length === 0 ? (
              <p className="text-center text-gray-800">No pending calls</p>
            ) : (
              <ul className="space-y-4">
                {calls.map((call) => (
                  <li
                    key={call.id}
                    className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-lg font-semibold text-gray-900">Caller: {call.caller_name}</p>
                    <p className="text-gray-800">Phone: {call.caller_phone}</p>
                    <p className="text-gray-800">Issue: {call.issue_type}</p>
                    <p className="text-gray-800">Priority: {call.priority}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center bg-black text-gray-300">
        <p>© 2025 OptiClaim by Roast and Toast</p>
      </footer>
    </div>
  );
}

export default PriorityManagement;