import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function CallQueueDashboard() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loggedInAgent = "Sundaresh";

  useEffect(() => {
    fetchAssignedCalls();
  }, []);

  const fetchAssignedCalls = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/call-queue/agent/${loggedInAgent}`);
      const data = await response.json();
      setCalls(data);
    } catch (error) {
      console.error("Error fetching calls:", error);
    }
    setLoading(false);
  };

  const handleCallRedirect = () => {
    navigate("/audio-analysis");
  };

  const handleAutoRedirect = () => {
    navigate("/autoresponse");
  };

  return (
    <div className="bg-white text-black min-h-screen font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 md:px-20 py-6 fixed w-full top-0 z-50 backdrop-blur-lg bg-white/90 shadow-lg border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">OptiClaim</h1>
        <div className="hidden md:flex gap-10 items-center text-gray-800 text-lg">
        <button onClick={() => navigate("/anisha")} className="hover:text-yellow-500 transition-colors">Anisha</button>
          <button onClick={() => navigate("/knowledge-base")} className="hover:text-yellow-500 transition-colors">Smart Search</button>
          <button onClick={() => navigate("/agenttraining")} className="hover:text-yellow-500 transition-colors">AI Agent Trainer</button>
          <button onClick={() => navigate("/feedbackanalysis")} className="hover:text-yellow-500 transition-colors">Claim Analyzer</button>
          <button className="px-8 py-3 rounded-full text-white bg-red-500 hover:bg-yellow-400 transition-all font-semibold shadow-lg">Logout</button>
        </div>
      </nav>
      <br></br>

      {/* Main Content */}
      <main className="pt-24 px-6 md:px-20">
        {/* Dashboard Header */}
        <header className="mb-12">
          <motion.h1 className="text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <center>Claim Management</center>
          </motion.h1>
        </header>

        {/* Calls Table */}
        {loading ? (
          <p className="text-center text-gray-800">Loading...</p>
        ) : (
          <motion.div className="bg-gradient-to-r from-gray-50 to-gray-200 rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-300">
                  <th className="py-4">Phone Number</th>
                  <th className="py-4">Caller Name</th>
                  <th className="py-4">Claim Title</th>
                  <th className="py-4">Claim Issue</th>
                  <th className="py-4">Action</th>
                  <th className="py-4">Automated Response Generator</th>
                </tr>
              </thead>
              <tbody>
                {/* Hardcoded Table Data */}
                <tr className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                  <td className="py-4">+1 555-1234</td>
                  <td className="py-4">John Doe</td>
                  <td className="py-4">Car Insurance Claim</td>
                  <td className="py-4">Delay in claim processing</td>
                  <td className="py-4">
                    <button onClick={handleCallRedirect} className="px-6 py-2 rounded-full text-white bg-green-500 hover:bg-green-400 transition-all font-semibold shadow-md">Call</button>
                  </td>
                  <td className="py-4">
                    <button onClick={handleAutoRedirect} className="px-6 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-400 transition-all font-semibold shadow-md">Auto Response</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                  <td className="py-4">+1 555-5678</td>
                  <td className="py-4">Jane Smith</td>
                  <td className="py-4">Health Insurance Claim</td>
                  <td className="py-4">Incorrect reimbursement amount</td>
                  <td className="py-4">
                    <button onClick={handleCallRedirect} className="px-6 py-2 rounded-full text-white bg-yellow-500 hover:bg-yellow-400 transition-all font-semibold shadow-md">Call</button>
                  </td>
                  <td className="py-4">
                    <button onClick={handleAutoRedirect} className="px-6 py-2 rounded-full text-white bg-yellow-500 hover:bg-yellow-400 transition-all font-semibold shadow-md">Auto Response</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                  <td className="py-4">+1 555-9101</td>
                  <td className="py-4">Robert Lee</td>
                  <td className="py-4">Home Damage Claim</td>
                  <td className="py-4">Denied claim without explanation</td>
                  <td className="py-4">
                    <button onClick={handleCallRedirect} className="px-6 py-2 rounded-full text-white bg-yellow-500 hover:bg-yellow-400 transition-all font-semibold shadow-md">Call</button>
                  </td>
                  <td className="py-4">
                    <button onClick={handleAutoRedirect} className="px-6 py-2 rounded-full text-white bg-yellow-500 hover:bg-yellow-400 transition-all font-semibold shadow-md">Auto Response</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                  <td className="py-4">+1 555-1122</td>
                  <td className="py-4">Emily Clark</td>
                  <td className="py-4">Travel Insurance Claim</td>
                  <td className="py-4">Lost baggage claim not processed</td>
                  <td className="py-4">
                    <button onClick={handleCallRedirect} className="px-6 py-2 rounded-full text-white bg-yellow-500 hover:bg-yellow-400 transition-all font-semibold shadow-md">Call</button>
                  </td>
                  <td className="py-4">
                    <button onClick={handleAutoRedirect} className="px-6 py-2 rounded-full text-white bg-yellow-500 hover:bg-yellow-400 transition-all font-semibold shadow-md">Auto Response</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 text-center bg-black text-gray-300 mt-24">
        <p>© 2025 OptiClaim by Roast and Toast</p>
      </footer>
    </div>
  );
}

export default CallQueueDashboard;