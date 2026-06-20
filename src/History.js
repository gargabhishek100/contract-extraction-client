import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./History.css";

export default function HistoryPage() {
  const [list, setList] = useState([]);
  const [load, setLoad] = useState(true);
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const pollIntervalRef = useRef(null); // Holds the interval ID

  // This function starts polling ONLY if there are 'pending' or 'processing' items
  const startPollingIfNeeded = (files) => {
    const needsPolling = files.some(
      (file) => file.status === 'pending' || file.status === 'processing'
    );

    if (needsPolling && !pollIntervalRef.current) {
      console.log("Starting status polling for pending/processing documents...");
      pollIntervalRef.current = setInterval(() => {
        setList((currentList) => {
          const processingItems = currentList.filter(
            (file) => file.status === 'pending' || file.status === 'processing'
          );

          if (processingItems.length === 0) {
            console.log("All processing finished. Stopping poll.");
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
            return currentList;
          }

          console.log(`Polling status for ${processingItems.length} documents...`);
          processingItems.forEach((item) => {
            fetch(`https://contract-extraction-server-u2ad.onrender.com/api/status/${item._id}`)
              .then((r) => r.json())
              .then((statusData) => {
                if (statusData.success && statusData.status !== item.status) {
                  setList((latestList) =>
                    latestList.map((f) =>
                      f._id === item._id ? { ...f, status: statusData.status } : f
                    )
                  );
                }
              })
              .catch((e) => console.error(`Failed to poll status for ${item._id}:`, e));
          });

          return currentList;
        });
      }, 5000);
    } else if (!needsPolling && pollIntervalRef.current) {
      console.log("No items are processing. Clearing existing poll.");
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    fetch("https://contract-extraction-server-u2ad.onrender.com/api/history")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setList(data.files);
          startPollingIfNeeded(data.files);
        } else {
          setErr(data.error || "Could not load history");
        }
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoad(false));

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const openDetail = (_id) => nav(`/contract/${_id}`);

  const getStatusBadge = (status) => {
    if (status === 'completed') return null;

    const statusConfig = {
      pending: { label: 'Pending...', class: 'history-status-pending' },
      processing: { label: 'Processing...', class: 'history-status-processing' },
      failed: { label: 'Failed', class: 'history-status-failed' },
    };

    const config = statusConfig[status] || { label: status, class: 'history-status-unknown' };
    return <span className={`history-status-badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="history-root">
      <header className="history-header">
        <div className="history-header-left">
          <button className="history-header-home-btn" onClick={() => nav("/")}>
            🏠 Home
          </button>
        </div>
        <div className="history-header-center">
          <span className="history-header-title">🕑 History</span>
        </div>
        <div className="history-header-right">{/* empty for balance */}</div>
      </header>

      <div className="history-card">
        <h1 className="history-title">Uploaded Contracts</h1>
        {load && <div className="history-spinner"><div className="history-loader" /></div>}
        {err && <p className="history-error">{err}</p>}
        <table className="history-table">
          <thead>
            <tr>
              <th>S. No.</th>
              <th>File Name</th>
              <th>Uploaded</th>
              <th>Status/Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((h, index) => (
              <tr key={h._id}>
                <td className="history-table-sno">{index + 1}</td>
                <td className="history-table-filename">{h.pdfName}</td>
                <td className="history-table-date">{new Date(h.createdAt).toLocaleString()}</td>
                <td className="history-table-action">
                  {h.status === 'completed' ? (
                    <button className="history-view-btn" onClick={() => openDetail(h._id)}>
                      View Details
                    </button>
                  ) : (
                    getStatusBadge(h.status)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="history-back-btn" onClick={() => nav(-1)}>← Back</button>
      </div>
    </div>
  );
}
