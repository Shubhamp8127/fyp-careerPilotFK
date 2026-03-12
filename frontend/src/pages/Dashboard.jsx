import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useTranslation } from "react-i18next";  // ✅ import
import "../styles/dashboard.css";
import { getDashboardData } from "../services/dashboardApi";
import apiClient from "../services/apiClient";
import DashboardProgressSection from "../components/DashboardProgress";
import { Bell, GraduationCap, Bookmark, Zap, Trophy, Map } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate(); 
  const { t } = useTranslation(); // ✅ get translation function
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [hasNotification, setHasNotification] = useState(false);
  const [savedColleges, setSavedColleges] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchData = async () => {
  try {
    setLoading(true);

    const dashboardData = await getDashboardData();

    const res = await apiClient.get("/api/colleges/bookmark/count");
    const savedData = res.data || {};

    dashboardData.colleges = savedData.count || 0;
    setSavedColleges(savedData.savedColleges || []);

    setData(dashboardData);
    setHasNotification(dashboardData.notifications > 0);

  } catch (err) {
    console.error(err);
    setError(t("dashboard.load_error"));
  } finally {

    // loader minimum 1.5 sec show karega
    setTimeout(() => {
      setLoading(false);
    }, 1500);

  }
};

  useEffect(() => {
    fetchData();

    const handleSavedUpdate = () => {
      fetchData();
    };
    window.addEventListener("saved-colleges-updated", handleSavedUpdate);

    return () => {
      window.removeEventListener("saved-colleges-updated", handleSavedUpdate);
    };
  }, []);

  if (error) return <p className="error">{error}</p>;
if (loading) {
  return (
    <div className="dashboard-loader">
      <div className="loader-card">
        <div className="spinner"></div>
        <h3>{t("Dashboard Loading")}</h3>
        <p>Preparing your dashboard...</p>
      </div>
    </div>
  );
}

  return (
    <div className="dashboard-container">

      {/* TOP RIGHT ACTIONS */}
      <div className="dashboard-actions">
        <div className="notification">
          <Bell size={18} />
          {hasNotification && <span className="dot" />}
        </div>
        <button className="view-profile" onClick={() => navigate("/profile")}>
          {t("view profile")}
        </button>
      </div>

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>
          {t("Welcome back")}, <span>{data.username}</span>!
        </h1>
        <p>{t("Continue your career discovery journey")}</p>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div
        className="stat-card"
        onClick={() => navigate("/quiz-history")}
        style={{ cursor: "pointer" }}
      >
          <div className="icon blue"><GraduationCap /></div>
          <h2>{data.quizzes}</h2>
          <p>{t("Quiz Completions")}</p>
        </div>

        <div className="stat-card" onClick={() => navigate("/saved-colleges")} style={{ cursor: "pointer" }}>
          <div className="icon pink"><Bookmark /></div>
          <h2>{savedColleges.length}</h2>
          <p>{t("Saved Colleges")}</p>
        </div>

        <div className="stat-card">
          <div className="icon purple"><Zap /></div>
          <h2>{data.skills}</h2>
          <p>{t("Skills Acquired")}</p>
        </div>

        <div className="stat-card">
          <div className="icon yellow"><Trophy /></div>
          <h2>{data.achievements}</h2>
          <p>{t("Achievements")}</p>
        </div>
      </div>

      {/* ROADMAP */}
      <div className="roadmap-card">
        <div className="roadmap-header">
          <h3>{t("Your 3D Roadmap Preview")}</h3>
          <span className="link">{t("Explore Full Roadmap")} →</span>
        </div>

        <div className="roadmap-content">
          <Map size={40} />
          <h4>{t("Generate Your First Roadmap")}</h4>
          <p>{t(" Create an AI-powered career roadmap to visualize your learning path and track progress")}</p>
          <button className="primary-btn">
            {t("Generate Your First Roadmap")}
          </button>
        </div>
      </div>

      {/* WEEKLY PROGRESS + RECENT ACTIVITY */}
      <DashboardProgressSection
        weeklyProgress={data.weeklyProgress}
        recentActivity={data.recentActivity}
      />
    </div>
  );
}