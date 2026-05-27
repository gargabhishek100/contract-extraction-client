// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./Submittals.css";

// export default function SubmittalsPage() {
//   const { state } = useLocation();
//   const file      = state?.file || null;
//   const id        = state?.id   || null;
//   const nav       = useNavigate();

//   const [list, setList] = useState(null);
//   const [load, setLoad] = useState(false);
//   const [err,  setErr ] = useState("");
//   const [meta, setMeta] = useState(null);

//   useEffect(() => {
//     const fetchSubs = async () => {
//       setLoad(true); setErr(""); setList(null);
//       if (id) {
//         try {
//           const r = await fetch(`http://localhost:5004/api/submittals/${id}`);
//           const j = await r.json();
//           if (!r.ok) throw new Error(j.error);
//           setList(j.submittals || []);
//           setMeta({ pdfName: j.pdfName });
//         } catch (e) { setErr(e.message); }
//         finally { setLoad(false); }
//         return;
//       }
//       if (!file) {
//         setErr("No PDF or ID found (go back and upload)");
//         setLoad(false);
//         return;
//       }
//       try {
//         const fd = new FormData(); fd.append("pdf", file);
//         const r  = await fetch("http://localhost:5004/api/submittals", {
//           method: "POST", body: fd
//         });
//         const j  = await r.json();
//         if (!r.ok) throw new Error(j.error);
//         setList(j.submittals || []);
//         setMeta(null);
//       } catch (e) { setErr(e.message); }
//         finally { setLoad(false); }
//     };
//     fetchSubs();
//   }, [file, id]);

//   return (
//     <div className="submittals-root">
//       <div className="submittals-card">
//         <button className="sub-back" onClick={()=>nav(-1)}>← Back</button>
//         <h1 className="submittals-title">📑 Required Submittals</h1>
//         {meta?.pdfName && <div className="sub-pdf">Document: <b>{meta.pdfName}</b></div>}
//         {err   && <p className="sub-error">{err}</p>}
//         {load  && <div className="sub-spinner"><div className="sub-loader"/></div>}

//         {list && (
//           list.length === 0
//             ? <div className="sub-empty">No explicit submittals found.</div>
//             : <ul className="sub-list">
//                 {list.map((s,i)=>(
//                   <li key={i}>
//                     <span className="sub-item">{s.item}</span>
//                     {s.page!=null && <span className="sub-page"> (pg {s.page})</span>}
//                     {s.reason   && <span className="sub-reason">{s.reason}</span>}
//                   </li>
//                 ))}
//               </ul>
//         )}
//       </div>
//     </div>
//   );
// }
