import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Download,
  Save,
  CheckCircle2,
  Circle,
  Briefcase,
  TrendingUp,
  Clock,
  Calendar,
  Zap,
  ChevronRight,
  Trophy
} from "lucide-react";
import "../styles/CareerRoadmapResult.css";
import Footer from "../components/Footer";

const CareerRoadmapResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const rawRoadmap = state?.roadmap || null;

  // Provide fallback structure to prevent crashes in case of malformed AI response
  const roadmap = typeof rawRoadmap === 'object' && rawRoadmap !== null ? rawRoadmap : null;

  const [activePhaseId, setActivePhaseId] = useState(1);

  if (!roadmap) {
    return (
      <>
        <div className="ai-container">
          <div className="ai-card" style={{ textAlign: "center", padding: "40px" }}>
            <h2>No Roadmap Found</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
              Please generate a new AI roadmap to view your personalized path.
            </p>
            <button className="continue-btn" onClick={() => navigate('/ai-roadmap')} style={{ width: "auto", padding: "10px 24px" }}>
              Back to Form
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const {
    career = "Career Path",
    level = "Beginner",
    timeline = "12 Months",
    hoursPerWeek = "10 hrs",
    finishBy = "Unknown",
    phases = [],
    skillProgress = [],
    nextMilestone = {}
  } = roadmap;

  const activePhaseInfo = phases.find(p => p.phaseId === activePhaseId) || phases[0] || {};

  return (
    <>
      <div className="roadmap-result-page">
        {/* Header Section */}
        <div className="roadmap-header-section">
          <div className="header-left">
            <h1 className="header-title">Your Personalized Roadmap <span className="emoji-icon">🚀</span></h1>
            <div className="header-subtitle">
              <span className="badge-career"><Briefcase size={16} /> {career}</span>
              <span className="dot-separator">•</span>
              <span>{level}</span>
              <span className="dot-separator">•</span>
              <span>{timeline} Plan</span>
            </div>
          </div>
          <div className="header-right">
            <button className="btn-outline">
              <Download size={16} /> Download PDF
            </button>
            <button className="btn-primary">
              <Save size={16} /> Save Roadmap
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="roadmap-grid">
          {/* Left Column: Timeline and Phases */}
          <div className="roadmap-main-col">

            {/* Horizontal Timeline */}
            <div className="timeline-horizontal">
              {phases.map((phase, index) => {
                const isActive = phase.phaseId === activePhaseId;
                const isCompleted = phase.status?.toLowerCase() === 'completed';
                const statusClass = isActive ? 'active' : isCompleted ? 'completed' : 'upcoming';

                return (
                  <div key={phase.phaseId} className="timeline-step-wrapper">
                    <div
                      className={`timeline-step ${statusClass}`}
                      onClick={() => setActivePhaseId(phase.phaseId)}
                    >
                      <div className="timeline-marker">
                        {isCompleted ? <CheckCircle2 size={16} /> : phase.phaseId}
                      </div>
                      <div className="timeline-label">Phase {phase.phaseId}</div>
                      <div className="timeline-duration">{phase.duration}</div>
                    </div>
                    {index < phases.length - 1 && (
                      <div className={`timeline-connector ${isCompleted || isActive ? 'active-connector' : ''}`}></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Phases List */}
            <div className="phases-list">
              {phases.map((phase) => {
                const isActive = phase.phaseId === activePhaseId;

                if (isActive) {
                  return (
                    <div key={phase.phaseId} className="phase-card active-phase-card">
                      <div className="phase-card-header">
                        <div className="phase-title-group">
                          <div className={`phase-dot phase-color-${phase.phaseId}`}></div>
                          <h2>Phase {phase.phaseId}: {phase.title}</h2>
                          <span className="phase-duration-badge">• {phase.duration}</span>
                        </div>
                        <div className="phase-progress-wrapper">
                          <span className="progress-text">{phase.progress || 0}% Complete</span>
                          <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${phase.progress || 0}%`, backgroundColor: `var(--phase-color-${phase.phaseId})` }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="phase-details-grid">
                        <div className="topics-col">
                          <h3>Topics</h3>
                          <ul className="topics-list">
                            {phase.topics?.map((topic, i) => (
                              <li key={i} className={topic.completed ? 'completed-topic' : ''}>
                                {topic.completed ? (
                                  <CheckCircle2 className="check-icon" size={18} />
                                ) : (
                                  <Circle className="uncheck-icon" size={18} />
                                )}
                                <span>{topic.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="tools-col">
                          <h3>✨ Tools</h3>
                          <div className="tools-grid">
                            {phase.tools?.map((tool, i) => (
                              <div key={i} className="tool-chip">
                                <div className="tool-icon-placeholder"></div>
                                {tool.name}
                              </div>
                            ))}
                          </div>
                        </div>

                        {phase.miniProject && (
                          <div className="project-col">
                            <h3 className="project-header">
                              <span className="project-icon">🧩</span> Mini Project
                            </h3>
                            <div className="project-card">
                              <h4>{phase.miniProject.title}</h4>
                              <span className="project-level">{phase.miniProject.level}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={phase.phaseId}
                      className="phase-list-item"
                      onClick={() => setActivePhaseId(phase.phaseId)}
                    >
                      <div className="phase-title-group">
                        <div className={`phase-dot phase-color-${phase.phaseId}`}></div>
                        <h3>Phase {phase.phaseId}: {phase.title}</h3>
                        <span className="phase-duration-badge">• {phase.duration}</span>
                      </div>
                      <div className="phase-status">
                        {phase.status || "Upcoming"} <ChevronRight size={16} />
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            <div style={{ marginTop: 20 }}>
              <button className="continue-btn" onClick={() => navigate('/ai-roadmap')} style={{ width: "auto", padding: "10px 24px" }}>
                Generate Another
              </button>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="roadmap-sidebar-col">

            <div className="sidebar-card">
              <h3 className="sidebar-title">Roadmap Overview</h3>
              <ul className="overview-list">
                <li>
                  <div className="overview-label"><Briefcase size={16} /> Career</div>
                  <div className="overview-value">• {career}</div>
                </li>
                <li>
                  <div className="overview-label"><TrendingUp size={16} /> Level</div>
                  <div className="overview-value">• {level}</div>
                </li>
                <li>
                  <div className="overview-label"><Clock size={16} /> Timeline</div>
                  <div className="overview-value">• {timeline}</div>
                </li>
                <li>
                  <div className="overview-label"><Zap size={16} /> Hours/Week</div>
                  <div className="overview-value">• {hoursPerWeek}</div>
                </li>
                <li>
                  <div className="overview-label"><Calendar size={16} /> Finish By</div>
                  <div className="overview-value">• {finishBy}</div>
                </li>
              </ul>
            </div>

            <div className="sidebar-card">
              <h3 className="sidebar-title">Skill Progress</h3>
              <div className="skills-list">
                {skillProgress?.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">• {skill.skill}</span>
                      <span className="skill-perc">{skill.progress}%</span>
                    </div>
                    <div className="skill-progress-bg">
                      <div
                        className={`skill-progress-fill color-${i % 4}`}
                        style={{ width: `${skill.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {nextMilestone?.title && (
              <div className="milestone-card">
                <div className="milestone-icon">
                  <Trophy size={20} />
                </div>
                <div className="milestone-content">
                  <h4 className="milestone-header">Next Milestone</h4>
                  <p className="milestone-title">{nextMilestone.title}</p>
                  <p className="milestone-deadline">
                    <Calendar size={14} /> Deadline: {nextMilestone.deadline}
                  </p>
                  <button className="btn-start">Start Learning <ChevronRight size={16} /></button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CareerRoadmapResult;
