import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function CallManagementDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0,
    escalated: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCallStats();
  }, []);

  const fetchCallStats = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/calls/call-stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching call stats:", error);
    }
  };

  // Function to determine the color based on the stat type
  const getStatColor = (statType) => {
    switch (statType) {
      case "pending":
        return "bg-blue-100 border-blue-500 text-blue-900"; // Blue for pending
      case "inProgress":
        return "bg-yellow-100 border-yellow-500 text-yellow-900"; // Yellow for in progress
      case "resolved":
        return "bg-green-100 border-green-500 text-green-900"; // Green for resolved
      case "escalated":
        return "bg-red-100 border-red-500 text-red-900"; // Red for escalated
      default:
        return "bg-gray-100 border-gray-500 text-gray-900"; // Default gray
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
          <button onClick={() => navigate("/login")} className="px-8 py-3 rounded-full text-white bg-red-500 hover:bg-red-400 transition-all font-semibold shadow-lg"> Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-6 md:px-20">
        <motion.div
          className="bg-gradient-to-r from-gray-100 to-gray-300 rounded-xl shadow-2xl p-8 w-full max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-8">📞 Call Management Dashboard</h2>

          {/* Call Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Pending Calls */}
            <div className={`p-6 rounded-xl border-l-4 ${getStatColor("pending")}`}>
              <h3 className="text-xl font-semibold mb-2">Pending Calls</h3>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>

            {/* In Progress Calls */}
            <div className={`p-6 rounded-xl border-l-4 ${getStatColor("inProgress")}`}>
              <h3 className="text-xl font-semibold mb-2">In Progress Calls</h3>
              <p className="text-3xl font-bold">{stats.inProgress}</p>
            </div>

            {/* Resolved Issues */}
            <div className={`p-6 rounded-xl border-l-4 ${getStatColor("resolved")}`}>
              <h3 className="text-xl font-semibold mb-2">Resolved Issues</h3>
              <p className="text-3xl font-bold">{stats.resolved}</p>
            </div>

            {/* Escalated Calls */}
            <div className={`p-6 rounded-xl border-l-4 ${getStatColor("escalated")}`}>
              <h3 className="text-xl font-semibold mb-2">Escalated Calls</h3>
              <p className="text-3xl font-bold">{stats.escalated}</p>
            </div>
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

export default CallManagementDashboard;