import React, { useState, useEffect } from "react";
import "./DocumentUpload.css";

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [documents, setDocuments] = useState([]);

  // Fetch all documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/knowledge/documents");
      const data = await response.json();
      if (response.ok) {
        setDocuments(data.documents);
      } else {
        setUploadStatus(`❌ Failed to fetch documents: ${data.error}`);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setUploadStatus("❌ Failed to fetch documents: Server Error");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/knowledge/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadStatus(`✅ Upload Successful: ${data.message}`);
        fetchDocuments(); // Refresh the document list
      } else {
        setUploadStatus(`❌ Upload Failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("❌ Upload Failed: Server Error");
    }
  };

  const handleDelete = async (filename) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/knowledge/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });

      const data = await response.json();
      if (response.ok) {
        setUploadStatus(`✅ Document Deleted: ${filename}`);
        fetchDocuments(); // Refresh the document list
      } else {
        setUploadStatus(`❌ Deletion Failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setUploadStatus("❌ Deletion Failed: Server Error");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Document Upload</h1>
      </header>

      <main className="dashboard-main">
        <div className="glass-card upload-container">
          <h2 className="upload-title">Upload a Document</h2>
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
          <button onClick={handleUpload} className="upload-button">
            Upload Document
          </button>
          {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        </div>

        <div className="glass-card document-list">
          <h2 className="upload-title">Uploaded Documents</h2>
          {documents.length > 0 ? (
            <ul>
              {documents.map((doc, index) => (
                <li key={index} className="document-item">
                  <span>{doc}</span>
                  <button
                    onClick={() => handleDelete(doc)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents uploaded yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default DocumentUpload;