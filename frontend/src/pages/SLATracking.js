import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SLATracking() {
  const [slaAlerts, setSlaAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSLAAlerts();
  }, []);

  const fetchSLAAlerts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/sla-tracking/check-sla");
      const data = await response.json();
      setSlaAlerts(data.sla_alerts);
    } catch (error) {
      console.error("Error fetching SLA alerts:", error);
    }
  };

  // Function to determine the gradient color based on SLA severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "bg-gradient-to-r from-red-400 to-red-500 text-white";
      case "Medium":
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900";
      case "Low":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 md:px-20 py-6 fixed w-full top-0 z-50 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">OptiClaim</h1>
        <div className="hidden md:flex gap-8 items-center text-gray-800 text-lg">
          <button onClick={() => navigate("/call-management")} className="hover:text-blue-500 transition-colors">📞 Call Management</button>
          <button onClick={() => navigate("/call-scheduling")} className="hover:text-blue-500 transition-colors">📅 Call Scheduling</button>
          <button onClick={() => navigate("/priority-management")} className="hover:text-blue-500 transition-colors">⚡ Priority Management</button>
          <button onClick={() => navigate("/sla-tracking")} className="hover:text-blue-500 transition-colors">📊 SLA Tracking</button>
          <button className="px-6 py-2 rounded-full text-white bg-red-500 hover:bg-red-400 transition-all font-semibold"> Logout</button>
        </div>
      </nav>
      <br></br>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-28 pb-16 px-6 md:px-20">
        <motion.div
          className="bg-white rounded-xl shadow-xl p-8 w-full max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-10">📊 SLA Tracking</h2>

          <div className="bg-white rounded-xl shadow-lg p-6 w-full">
            {slaAlerts.length === 0 ? (
              <p className="text-center text-gray-800">No SLA breaches</p>
            ) : (
              <ul className="space-y-4">
                {slaAlerts.map((alert) => (
                  <li
                    key={alert.call_id}
                    className={`p-6 rounded-lg shadow-md border-l-4 ${getSeverityColor(alert.priority)}`}
                  >
                    <p className="text-lg font-semibold">Caller: {alert.caller_name}</p>
                    <p className="text-white-800">Priority: {alert.priority}</p>
                    <p className="text-white-800">Status: {alert.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center bg-black text-gray-300">
        <p>© 2025 OptiClaim by Roast and Toast</p>
      </footer>
    </div>
  );
}

export default SLATracking;