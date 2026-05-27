import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage        from "./Home";
import SubmittalsPage  from "./Submittal";
import "./App.css";
import HistoryPage from "./History";
import ContractDetail from "./ContractDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/submittals"  element={<SubmittalsPage />} />
         <Route path="/history"     element={<HistoryPage />} />
         <Route path="/contract/:id"element={<ContractDetail />} />
      </Routes>

      {/* <footer className="footer">
        Built with&nbsp;❤️ by Team 3 
      </footer> */}
    </BrowserRouter>
  );
}
