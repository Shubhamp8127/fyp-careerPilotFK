import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Footer from "../components/Footer";

const CareerRoadmapResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const roadmap = state?.roadmap || null;

  if (!roadmap) {
    return (
      <div className="ai-container">
        <div className="ai-card">
          <h2>Your AI Career Roadmap</h2>
          <p>No roadmap found. Please generate a roadmap first.</p>
          <div style={{ marginTop: 12 }}>
            <button className="continue-btn" onClick={() => navigate('/ai-roadmap')}>Back to Form</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="ai-container">
        <div className="ai-card">
          <h1 className="top-heading">Your AI Career Roadmap</h1>
          <div className="roadmap-content markdown-body" style={{ marginTop: 16 }}>
            <ReactMarkdown>{roadmap}</ReactMarkdown>
          </div>
          <div style={{ marginTop: 20 }}>
            <button className="continue-btn" onClick={() => navigate('/ai-roadmap')}>Generate Another</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CareerRoadmapResult;
