import React from "react";
import { useNavigate } from "react-router-dom";
import { getRoles, logout } from "../authService";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const roles = getRoles();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Sample Data
  const claimsData = [
    { id: "C123", issue: "Fraud", agent: "Avijeet", sentiment: "Negative", priority: "High", sla: "Breached" },
    { id: "C124", issue: "Account Locked", agent: "Bob", sentiment: "Neutral", priority: "Medium", sla: "Not Breached" },
    { id: "C125", issue: "Payment Issue", agent: "Sayan", sentiment: "Negative", priority: "High", sla: "Not Breached" },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen font-sans flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 md:px-20 py-6 fixed w-full top-0 z-50 backdrop-blur-lg bg-white/90 shadow-lg border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">OptiClaim</h1>
        <div className="hidden md:flex gap-6 items-center text-gray-800 text-lg">
          <button onClick={() => navigate("/call-management")} className="hover:text-yellow-500 transition-colors">📞 Call Management</button>
          <button onClick={() => navigate("/call-scheduling")} className="hover:text-yellow-500 transition-colors">📅 Call Scheduling</button>
          <button onClick={() => navigate("/priority-management")} className="hover:text-yellow-500 transition-colors">⚡ Priority Management</button>
          <button onClick={() => navigate("/sla-tracking")} className="hover:text-yellow-500 transition-colors">📊 SLA Tracking</button>
          <button onClick={() => navigate("/document-upload")} className="hover:text-yellow-500 transition-colors">📑 Documents</button>
          <button onClick={handleLogout} className="px-8 py-3 rounded-full text-white bg-red-500 hover:bg-red-400 transition-all font-semibold shadow-lg">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-6 md:px-20">
        <motion.div
          className="bg-gradient-to-r from-gray-100 to-gray-300 rounded-xl shadow-2xl p-8 w-full max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Claims Table */}
          <div className="w-full overflow-x-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6"><center>Claims</center></h2>
            <table className="w-full bg-white rounded-xl shadow-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Claim ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Claim Issue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Agent Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tracked Sentiment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SLA Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {claimsData.map((claim, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">{claim.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{claim.issue}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{claim.agent}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{claim.sentiment}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{claim.priority}</td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold ${
                        claim.sla === "Breached" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {claim.sla}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br></br>
          <div>
  <center>
    <button
      onClick={() => navigate("/analytics-overview")}
      className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      Analytics Overview
    </button>
  </center>
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

export default Dashboard;