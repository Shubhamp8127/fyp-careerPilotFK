import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Database,
  Palette,
  Smartphone,
  Server,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Target,
  Award,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import "../styles/CareerRoadmap.css";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import { markFeatureUsed } from "../services/dashboardApi";

const CareerRoadmap = () => {
  const [selected, setSelected] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [step, setStep] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(""); // new state
  const [hours, setHours] = useState(10);
  const [timeline, setTimeline] = useState(6);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [learningStyle, setLearningStyle] = useState("Mixed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    markFeatureUsed().catch((err) => {
      console.error("Feature usage tracking failed:", err);
    });
  }, []);

  const careers = [
    { name: "Full-Stack Web Developer", icon: <Code2 size={20} /> },
    { name: "Data Scientist", icon: <Database size={20} /> },
    { name: "UI/UX Designer", icon: <Palette size={20} /> },
    { name: "Mobile App Developer", icon: <Smartphone size={20} /> },
    { name: "DevOps Engineer", icon: <Server size={20} /> },
    { name: "Cybersecurity Specialist", icon: <ShieldCheck size={20} /> },
  ];

  const areas = [
    "Frontend Development",
    "Backend Development",
    "Mobile Development",
    "Data Analysis",
    "Machine Learning",
    "UI/UX Design",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "Game Development",
    "Blockchain",
    "IoT",
  ];

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <>
      <div className="ai-container">
        <div className="ai-card">
          <h1 className="top-heading">AI Roadmap Generator</h1>
          <p className="top-subtitle">Create a personalized career learning path with AI</p>

          {/* Stepper */}
          <div className="stepper top-stepper">
            <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
            <div className={`line ${step >= 2 ? "filled" : ""}`}></div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
            <div className={`line ${step >= 3 ? "filled" : ""}`}></div>
            <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
          </div>

          {/* Animated Step Content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <h1 className="main-heading">
                  Choose Your Career Goal
                </h1>

                <p className="subtitle">
                  What career path do you want to pursue?
                </p>

                <div className="career-grid">
                  {careers.map((career, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className={`career-card ${selected === career.name ? "selected" : ""
                        }`}
                      onClick={() => setSelected(career.name)}
                    >
                      <div className="career-icon">{career.icon}</div>
                      <span>{career.name}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="divider">
                  <span>Or</span>
                </div>

                <input
                  type="text"
                  placeholder="Custom Career Goal"
                  className="custom-input"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="step-content"
              >
                <h1 className="main-heading">
                  What's Your Current Level?
                </h1>

                <p className="subtitle">
                  This helps us customize the roadmap difficulty
                </p>

                <div className="level-container">
                  <div
                    className={`level-card ${selectedLevel === "Beginner" ? "active" : ""}`}
                    onClick={() => setSelectedLevel("Beginner")}
                  >
                    <div className="level-icon beginner">
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <h3>Beginner</h3>
                      <p>New to the field with little to no experience</p>
                    </div>
                  </div>

                  <div
                    className={`level-card ${selectedLevel === "Intermediate" ? "active" : ""}`}
                    onClick={() => setSelectedLevel("Intermediate")}
                  >
                    <div className="level-icon intermediate">
                      <Target size={22} />
                    </div>
                    <div>
                      <h3>Intermediate</h3>
                      <p>Some experience with basic concepts and tools</p>
                    </div>
                  </div>

                  <div
                    className={`level-card ${selectedLevel === "Advanced" ? "active" : ""}`}
                    onClick={() => setSelectedLevel("Advanced")}
                  >
                    <div className="level-icon advanced">
                      <Award size={22} />
                    </div>
                    <div>
                      <h3>Advanced</h3>
                      <p>Experienced professional looking to specialize</p>
                    </div>
                  </div>
                </div>

                <div className="bottom-buttons">
                  <button className="back-btn" onClick={() => setStep(1)}>
                    <ChevronLeft size={18} className="btn-icon-left" />
                    Back
                  </button>

                  <button
                    className="continue-btn"
                    onClick={handleContinue}
                    disabled={!selectedLevel} // disable until user selects a level
                    style={{
                      opacity: !selectedLevel ? 0.5 : 1,
                      cursor: !selectedLevel ? "not-allowed" : "pointer",
                    }}
                  >
                    Continue
                    <ChevronRight size={18} className="btn-icon" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="step-content"
              >
                <h1 className="main-heading">
                  Customize Your Learning
                </h1>

                <p className="subtitle">
                  Tell us about your preferences and timeline
                </p>

                {/* Areas of Interest */}
                <div className="interest-section">
                  <h3 className="section-title">Areas of Interest</h3>

                  <div className="interest-grid">
                    {areas.map((area, index) => (
                      <div
                        key={index}
                        className={`interest-item ${selectedAreas.includes(area) ? "active" : ""
                          }`}
                        onClick={() =>
                          setSelectedAreas((prev) =>
                            prev.includes(area)
                              ? prev.filter((a) => a !== area)
                              : [...prev, area]
                          )
                        }
                      >
                        {area}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Style */}
                <div className="learning-section">
                  <h3 className="section-title">Learning Style</h3>

                  <div className="learning-grid">
                    {["Visual", "Hands-on", "Theoretical", "Mixed"].map((style) => (
                      <div
                        key={style}
                        className={`learning-card ${learningStyle === style ? "active" : ""
                          }`}
                        onClick={() => setLearningStyle(style)}
                      >
                        <h4>{style}</h4>
                        <p>
                          {style === "Visual" && "Learn through diagrams and videos"}
                          {style === "Hands-on" && "Learn by building projects"}
                          {style === "Theoretical" && "Learn through reading and concepts"}
                          {style === "Mixed" && "Combination of all learning approaches"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div className="slider-section">

                  {/* Hours Slider */}
                  <div className="slider-box">
                    <label>Time Commitment (hours/week)</label>

                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                    />

                    <div className="range-values">
                      <span>5h</span>
                      <span className="live-value">{hours}h</span>
                      <span>40h</span>
                    </div>
                  </div>

                  {/* Timeline Slider */}
                  <div className="slider-box">
                    <label>Target Timeline (months)</label>

                    <input
                      type="range"
                      min="3"
                      max="24"
                      value={timeline}
                      onChange={(e) => setTimeline(Number(e.target.value))}
                    />

                    <div className="range-values">
                      <span>3m</span>
                      <span className="live-value">{timeline}m</span>
                      <span>24m</span>
                    </div>
                  </div>

                </div>

                {/* Buttons */}
                <div className="bottom-buttons">
                  <button className="back-btn" onClick={() => setStep(2)}>
                    <ChevronLeft size={18} className="btn-icon-left" />
                    Back
                  </button>

                  <button
                    className="continue-btn generate-btn"
                    disabled={selectedAreas.length === 0 || loading}
                    style={{
                      opacity: selectedAreas.length === 0 ? 0.5 : 1,
                      cursor: selectedAreas.length === 0 ? "not-allowed" : "pointer",
                    }}
                    onClick={async () => {
                      // assemble payload
                      setError("");
                      const payload = {
                        careerGoal: selected || customGoal,
                        level: selectedLevel,
                        interests: selectedAreas,
                        learningStyle,
                        hoursPerWeek: hours,
                        timeline,
                      };

                      try {
                        setLoading(true);
                        const res = await apiClient.post("/api/generate-roadmap/", payload);

                        const data = res.data;
                        const roadmap = data?.roadmap || "";

                        // navigate to result page with roadmap in state
                        navigate("/ai-roadmap/result", { state: { roadmap } });
                      } catch (err) {
                        console.error(err);
                        setError(err.response?.data?.error || err.message || "Generation failed");
                        setLoading(false);
                      }
                    }}
                  >
                    {loading ? "Generating..." : "Generate Roadmap"}
                    <Sparkles size={18} className="btn-icon-left" />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Continue Button */}
          {step === 1 && (
            <button
              className="continue-btn"
              onClick={handleContinue}
              disabled={!selected && !customGoal}
              style={{
                opacity: !selected && !customGoal ? 0.5 : 1,
                cursor: !selected && !customGoal ? "not-allowed" : "pointer",
              }}
            >
              Continue
              <ChevronRight size={18} className="btn-icon" />
            </button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CareerRoadmap;