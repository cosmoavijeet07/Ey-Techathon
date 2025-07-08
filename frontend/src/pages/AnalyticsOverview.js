import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Register chart elements
Chart.register(ArcElement, Tooltip, Legend);

function AnalyticsOverview() {
  const [analytics, setAnalytics] = useState({
    totalInteractions: 0,
    resolved: 0,
    escalated: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Mock API call to fetch analytics data
    const fetchAnalyticsData = async () => {
      const data = {
        totalInteractions: 500,
        resolved: 450,
        escalated: 50,
      };
      setAnalytics(data);
    };

    fetchAnalyticsData();
  }, []);

  const chartData = {
    labels: ["Resolved", "Escalated"],
    datasets: [
      {
        data: [analytics.resolved, analytics.escalated],
        backgroundColor: ["#FFC107", "#002244"],
        hoverBackgroundColor: ["#E0A800", "#004080"],
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 14 },
          color: "#4B5563",
        },
      },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <nav className="flex justify-between items-center px-10 md:px-20 py-6 fixed w-full top-0 z-50 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">OptiClaim</h1>
        <div className="hidden md:flex gap-8 items-center text-gray-800 text-lg">
          <button onClick={() => navigate("/call-management")} className="hover:text-blue-500 transition-colors">📞 Call Management</button>
          <button onClick={() => navigate("/call-scheduling")} className="hover:text-blue-500 transition-colors">📅 Call Scheduling</button>
          <button onClick={() => navigate("/priority-management")} className="hover:text-blue-500 transition-colors">⚡ Priority Management</button>
          <button onClick={() => navigate("/sla-tracking")} className="hover:text-blue-500 transition-colors">📊 SLA Tracking</button>
          <button className="px-6 py-2 rounded-full text-white bg-red-500 hover:bg-red-400 transition-all font-semibold">🚪 Logout</button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center pt-28 pb-16 px-6 md:px-20">
        <motion.div
          className="bg-white rounded-xl shadow-xl p-8 w-full max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-10">📊 Analytics Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center shadow-md border border-blue-200">
              <h3 className="text-xl text-blue-600 font-bold">Total Interactions</h3>
              <p className="text-4xl font-semibold text-gray-900">{analytics.totalInteractions}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 text-center shadow-md border border-green-200">
              <h3 className="text-xl text-green-600 font-bold">Resolved</h3>
              <p className="text-4xl font-semibold text-gray-900">{analytics.resolved}</p>
            </div>

            <div className="bg-red-50 rounded-lg p-6 text-center shadow-md border border-red-200">
              <h3 className="text-xl text-red-600 font-bold">Escalated</h3>
              <p className="text-4xl font-semibold text-gray-900">{analytics.escalated}</p>
            </div>
          </div>

          <div className="mt-10 bg-white rounded-lg shadow-md p-6 max-w-md mx-auto" style={{ height: '300px' }}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </motion.div>
      </main>

      <footer className="py-6 text-center bg-black text-gray-300">
        <p>© 2025 OptiClaim by Roast and Toast</p>
      </footer>
    </div>
  );
}

export default AnalyticsOverview;