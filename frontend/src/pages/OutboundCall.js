import React, { useState } from "react";

const OutboundCallPage = () => {
  const [loading, setLoading] = useState(false);
  const [callStatus, setCallStatus] = useState(null);

  const handleMadeCall = async () => {
    setLoading(true);
    setCallStatus(null);

    try {
      const webhookUrl = "https://hook.us2.make.com/dqldexdvej6h6yqmnak85lhi3qpamh0f";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // No body is required as per your requirement
      });

      if (!response.ok) {
        throw new Error("Failed to trigger call");
      }

      // Assuming the response is just "ok"
      const data = await response.text();
      if (data === "ok") {
        setCallStatus("Call made successfully!");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      setCallStatus("Calling..., You can Schedule other calls");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => window.history.back()}>
          &larr; Back
        </button>
        <h1 style={styles.title}>Schedule Anisha's Call</h1>
      </div>

      {/* Embedded Google Form */}
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSd3LDo55rggCMao5BUdTX4hYT8u6sv0iIguqJfMR4Sqav1DJQ/viewform?embedded=true"
        width="640"
        height="687"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Schedule Call Form"
      >
        Loading…
      </iframe>

      {/* Made Call Button */}
      <div style={styles.buttonContainer}>
        <button
          onClick={handleMadeCall}
          disabled={loading}
          style={styles.madeCallButton}
        >
          {loading ? "Making Call..." : "Made Call"}
        </button>
      </div>

      {/* Call Status Notification */}
      {callStatus && <p style={styles.callStatus}>{callStatus}</p>}
    </div>
  );
};

// Styles
const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    textAlign: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  backButton: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    marginRight: "10px",
  },
  title: {
    fontSize: "24px",
    margin: "0",
  },
  buttonContainer: {
    margin: "20px 0",
  },
  madeCallButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  callStatus: {
    marginTop: "10px",
    color: "#28a745",
    fontSize: "16px",
  },
};

export default OutboundCallPage;