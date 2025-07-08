import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SentimentDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [sentimentData, setSentimentData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [joke, setJoke] = useState("");
  const [isJokeOpen, setIsJokeOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/sentiment/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSentimentData = async () => {
      const endpoint = selectedUser
        ? `http://127.0.0.1:5000/api/sentiment/sentiment-history/${selectedUser}`
        : "http://127.0.0.1:5000/api/sentiment/sentiment-history/all";
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setSentimentData(data);

        const labels = data.map((entry) => new Date(entry.timestamp).toLocaleDateString());
        const scores = data.map((entry) => entry.sentiment_score);
        setChartData({
          labels,
          datasets: [
            {
              label: "Sentiment Score Over Time",
              data: scores,
              fill: true,
              backgroundColor: "rgba(75, 192, 192, 0.2)", // Light blue fill
              borderColor: "rgba(75, 192, 192, 1)", // Solid blue line
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
              pointBorderColor: "#fff",
              pointRadius: 5,
              borderWidth: 3,
              tension: 0.4, // Smoother curve
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
      }
    };

    fetchSentimentData();
  }, [selectedUser]);

  // Fetch a joke when the button is clicked
  const fetchJoke = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/jokes/get-joke");
      const data = await response.json();
      setJoke(data.joke || "Couldn’t fetch a joke, but you’re awesome anyway! 😃");
      setIsJokeOpen(true);
    } catch (error) {
      console.error("Error fetching joke:", error);
      setJoke("Oops! Something went wrong. Stay positive! ✨");
      setIsJokeOpen(true);
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
          <h2 className="text-4xl font-bold text-gray-900 mb-8">📊 Sentiment Dashboard</h2>

          {/* User Selection Dropdown */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <label className="text-lg font-semibold text-gray-900">Select User:</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sentiment Trend Chart */}
          <div className="h-[500px] w-full">
            {chartData.labels ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: "top",
                      labels: {
                        color: "#000000",
                        font: { size: 14 },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: "#000000" },
                    },
                    y: {
                      grid: { color: "rgba(0, 0, 0, 0.1)" },
                      ticks: { color: "#000000" },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-center text-gray-800">📉 No sentiment data available.</p>
            )}
          </div>

          {/* Joke Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={fetchJoke}
              className="px-6 py-3 rounded-full text-white bg-purple-600 hover:bg-purple-500 transition-all font-semibold shadow-md"
            >
              Need a Boost? 🤗
            </button>
          </div>

          {/* Joke Modal */}
          {isJokeOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Here's a Joke for You!</h3>
                <p className="text-gray-800">{joke}</p>
                <button
                  onClick={() => setIsJokeOpen(false)}
                  className="mt-6 px-6 py-3 rounded-full text-white bg-red-500 hover:bg-red-400 transition-all font-semibold shadow-md"
                >
                  Close
                </button>
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

export default SentimentDashboard;