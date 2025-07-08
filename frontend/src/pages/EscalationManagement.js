import React, { useState, useEffect } from "react";
import "./EscalationManagement.css"; // Import the same CSS file for consistency

function EscalationManagement() {
  const [escalatedCalls, setEscalatedCalls] = useState([]);

  useEffect(() => {
    // Mock API call to fetch escalated calls
    const fetchEscalatedCalls = async () => {
      const data = [
        { id: 1, client: "Sundaresh", issue: "Claim Delay", status: "Escalated" },
        { id: 2, client: "Afrin", issue: "Incorrect Information", status: "Resolved" },
      ];
      setEscalatedCalls(data);
    };

    fetchEscalatedCalls();
  }, []);

  const handleResolve = (id) => {
    setEscalatedCalls(escalatedCalls.filter((call) => call.id !== id));
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Escalation Management</h1>
      </header>

      <main className="dashboard-main">
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Escalation Management</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Issue</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {escalatedCalls.map((call) => (
                <tr key={call.id} className="hover:bg-gray-100 transition-colors">
                  <td className="px-4 py-2 border border-gray-300">{call.client}</td>
                  <td className="px-4 py-2 border border-gray-300">{call.issue}</td>
                  <td className="px-4 py-2 border border-gray-300">{call.status}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <button
                      onClick={() => handleResolve(call.id)}
                      className="glass-card action-button"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default EscalationManagement;