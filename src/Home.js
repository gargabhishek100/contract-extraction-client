import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [currentId, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const nav = useNavigate();

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setError(""); setId(null); setSuccess(false);
  };

  const extractCoreFields = async () => {
    if (!file) return setError("Please upload a PDF first!");

    setLoading(true); setError(""); setId(null); setSuccess(false);
    try {
      const fd = new FormData(); fd.append("pdf", file);
      const r = await fetch("https://contract-extraction-server-u2ad.onrender.com/api/summarize", { 
        method: "POST", 
        body: fd 
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      
      setId(j._id);
      setUploadedFileName(j.pdfName);
      setSuccess(true);
      
      setTimeout(() => {
        nav("/history");
      }, 4000);
      
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const gotoHistory = () => nav("/history");

  return (
    <div className="home-page-root">
      <header className="home-header">
        <div className="home-header-left">
            {/* Empty for balance */}
        </div>
        <div className="home-header-center">
            <span className="home-header-title">📘 Contract Extractor</span>
        </div>
        <div className="home-header-right">
            <button className="home-header-history-btn" onClick={gotoHistory}>🕑 History</button>
        </div>
      </header>

      <main className="home-main-content">
        <section className="home-upload-card">
          <h1 className="home-upload-heading">Upload a PDF</h1>
          <p className="home-upload-subtitle">
            Get instant AI-powered, structured contract analysis.
          </p>
          <div className="home-upload-box">
            <input
              type="file"
              accept="application/pdf"
              id="homePdfInput"
              onChange={handleFile}
            />
            <label htmlFor="homePdfInput">
              {file ? file.name : "Click to upload your PDF"}
            </label>
          </div>
          {error && <p className="home-error-msg">{error}</p>}
          <div className="home-btn-row">
            <button className="home-upload-btn" onClick={extractCoreFields} disabled={loading || success}>
              {loading ? "Uploading…" : success ? "Uploaded ✓" : "Upload & Process"}
            </button>
          </div>
        </section>

        {loading && (
          <div className="home-spinner"><div className="home-loader" /></div>
        )}

        {success && (
          <section className="home-success-card">
            <div className="home-success-icon">✓</div>
            <h2 className="home-success-title">Upload Successful!</h2>
            <p className="home-success-message">
              <strong>{uploadedFileName}</strong> has been uploaded and is being processed.
            </p>
            <p className="home-success-redirect">
              Redirecting to History page...
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

