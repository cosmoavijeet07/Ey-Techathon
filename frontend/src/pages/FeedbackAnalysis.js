import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

Chart.register(ArcElement, Tooltip, Legend);

function FeedbackAnalysis() {
  const [data, setData] = useState({ grouped_feedback_counts: {}, advice: {} });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/feedback_analysis/analyze-feedback")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const chartData = {
    labels: Object.keys(data.grouped_feedback_counts),
    datasets: [
      {
        data: Object.values(data.grouped_feedback_counts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
        hoverBackgroundColor: ["#FF4365", "#2E7CB8", "#D4A233", "#3A9A48"],
        borderWidth: 2,
      },
    ],
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
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Feedback Analysis</h2>

          {loading ? (
            <p className="text-center text-gray-800">Loading feedback data...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Chart Section */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full h-96"> {/* Increased height for the chart */}
                  <Pie
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { color: "#000000", font: { size: 14 } },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Summary Section */}
              <div className="flex-1 bg-white rounded-xl shadow-lg p-6 w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Powered Feedback Summary</h3>
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-300">
                      <th className="py-4">Category</th>
                      <th className="py-4">Frequency</th>
                      <th className="py-4">AI Advice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.advice).map(([category, summary]) => (
                      <tr key={category} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                        <td className="py-4">{category}</td>
                        <td className="py-4">{data.grouped_feedback_counts[category]}</td>
                        <td className="py-4">{summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
}

export default FeedbackAnalysis;