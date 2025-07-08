import React, { useState, useEffect } from "react";
import "./ClientInteractionHistory.css"; // Import the same CSS file

function ClientInteractionHistory() {
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    // Mock API call to fetch interaction history
    const fetchInteractions = async () => {
      const data = [
        { id: 1, client: "Sundaresh", date: "2025-01-10", type: "Call", status: "Resolved" },
        { id: 2, client: "Afrin", date: "2025-01-09", type: "Chat", status: "Pending" },
      ];
      setInteractions(data);
    };

    fetchInteractions();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Client Interaction History</h1>
      </header>

      <main className="dashboard-main">
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Client Interaction History</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {interactions.map((interaction) => (
                <tr key={interaction.id}>
                  <td className="px-4 py-2">{interaction.client}</td>
                  <td className="px-4 py-2">{interaction.date}</td>
                  <td className="px-4 py-2">{interaction.type}</td>
                  <td className="px-4 py-2">{interaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ClientInteractionHistory;