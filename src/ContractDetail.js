import React, { useEffect, useState } from "react";
import { useParams, useNavigate }     from "react-router-dom";
import "./ContractDetail.css";

const FIELD_LABELS = {
  ClientName: "Client Name",
  FundingAgency: "Funding Agency",
  BiddingSystem: "Bidding System",
  NameOfWork: "Name of the Work",
  ProjectLocation: "Project Location",
  CompletionPeriod: "Completion Period",
  EstimatedCost: "Estimated Cost",
  TenderDocumentCost: "Cost of Tender Document",
  EMD: "E.M.D.",
  ImportantDates: "Important Dates",
  BidValidity: "Bid Validity",
  TenderSecurity: "Tender Security",
  JointVenture: "Joint Venture Allowed?",
  PowerOfAttorney: "Power of Attorney",
  GroundsForBidRejection: "Grounds for Bid Rejection",
  EligibilityCriteria: "Eligibility Criteria",
  SiteVisit: "Site Visit",
  GeotechnicalReports: "Geotechnical Investigation Reports",
  LandAvailability: "Land Availability",
  OtherLandAvailability: "Other Land Availability"
};

export default function ContractDetail() {
  const { id }   = useParams();
  const nav      = useNavigate();
  const [data, setData] = useState(null); // { pdfName, fields }
  const [subs, setSubs] = useState(null); // submittals array
  const [load, setLoad] = useState(true);
  const [err,  setErr ] = useState("");

  useEffect(() => {
    setLoad(true); setErr("");
    Promise.all([
      fetch(`https://contract-extraction-server-u2ad.onrender.com/api/summarize/${id}`).then(r=>r.json()),
      fetch(`https://contract-extraction-server-u2ad.onrender.com/api/submittals/${id}`).then(r=>r.json())
    ]).then(([summary, subm]) => {
      if (!summary.success) throw new Error(summary.error || "Summary failed");
      if (!subm.success) throw new Error(subm.error || "Submittals failed");
      setData({ pdfName: summary.pdfName, fields: summary.fields });
      setSubs(subm.submittals);
    })
    .catch(e => setErr(e.message))
    .finally(()=>setLoad(false));
  }, [id]);

  const renderVal = v => v==null||v==="" ? <span className="empty">—</span> : v;

  return (
    <div className="contract-full-root">
      <header className="page-header">
        <button className="back-btn" onClick={()=>nav(-1)}>← Back</button>
        <span className="contract-filename">{data?.pdfName || "Contract Details"}</span>
        <span style={{width: 60}}></span>
      </header>
      <main className="contract-main">
        {err && <p className="error">{err}</p>}
        {load && <div className="spinner"><div className="loader" /></div>}
        {data && (
          <>
            <section className="contract-section">
              <h2 className="section-heading">Summary Fields</h2>
              <div className="fields-table-wrapper">
                <table className="fields-table">
                  <tbody>
                    {Object.entries(FIELD_LABELS).map(([k,l])=>(
                      <tr key={k}>
                        <th>{l}</th>
                        <td>{renderVal(data.fields[k])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="contract-section">
              <h2 className="section-heading">Required Submittals</h2>
              {(subs && subs.length > 0) ? (
                <div className="submittal-table-scroll">
                  <table className="submittal-table">
                    <thead>
                      <tr>
                        <th>S. No.</th>
                        <th>Item</th>
                        <th>Page</th>
                        <th>Reason/Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subs.map((s,i)=>(
                        <tr key={i}>
                          <td className="sno">{i+1}</td>
                          <td className="item">{s.item}</td>
                          <td className="page">{s.page == null ? "—" : s.page}</td>
                          <td className="reason">{s.reason || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-table-msg">No explicit submittals found for this document.</div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
