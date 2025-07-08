import React, { useState } from "react";
import "./BatchProcessing.css"; // Import the same external CSS

function BatchProcessing() {
  const [status, setStatus] = useState("Idle");
  const [processedItems, setProcessedItems] = useState([]);

  const handleProcessBatch = async () => {
    setStatus("Processing...");

    // Example batch data (can be modified as needed)
    const batchData = { items: [1, 2, 3, 4, 5] };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/batch-processing/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batchData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Completed");
        setProcessedItems(result.processed_items);
      } else {
        setStatus("Failed");
        alert(result.error || "Batch processing failed!");
      }
    } catch (error) {
      setStatus("Error");
      console.error("Error processing batch:", error);
      alert("Error processing batch!");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Batch Processing</h1>
      </header>

      <main className="dashboard-main">
        <div className="glass-card">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Batch Processing</h2>
            <button
              onClick={handleProcessBatch}
              className="glass-card action-button"
            >
              Start Batch Processing
            </button>
            <div className="mt-4">
              <p>Status: {status}</p>
              {processedItems.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-bold">Processed Items:</h3>
                  <ul className="list-disc ml-5">
                    {processedItems.map((item) => (
                      <li key={item.id}>{`Item ${item.id}: ${item.status}`}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BatchProcessing;