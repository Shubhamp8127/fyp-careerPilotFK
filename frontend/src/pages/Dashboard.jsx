import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useTranslation } from "react-i18next";
import "../styles/dashboard.css";
import { getDashboardData } from "../services/dashboardApi";
import apiClient from "../services/apiClient";
import DashboardProgressSection from "../components/DashboardProgress";
import { Bell, GraduationCap, Bookmark, Zap, Map, BookOpen, Trash2, X, Activity } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate(); 
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [hasNotification, setHasNotification] = useState(false);
  const [savedColleges, setSavedColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [removingCollegeId, setRemovingCollegeId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const dashboardData = await getDashboardData();

      const res = await apiClient.get("/api/colleges/bookmark");
      const savedData = res.data || {};

      dashboardData.colleges = savedData.count || 0;
      setSavedColleges(savedData.savedColleges || []);

      setData(dashboardData);
      setHasNotification(dashboardData.notifications > 0);

    } catch (err) {
      console.error(err);
      setError(t("dashboard.load_error"));
    } finally {
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

  const handleShowSaved = () => {
    setShowSavedModal(true);
  };

  const handleRemoveSavedCollege = async (collegeId) => {
    setRemovingCollegeId(collegeId);

    try {
      await apiClient.delete(`/api/colleges/bookmark/${collegeId}`);
      const updated = savedColleges.filter((item) => item.id !== collegeId);
      setSavedColleges(updated);
      if (data) {
        setData((prev) => ({ ...prev }));
      }
      window.dispatchEvent(new Event("saved-colleges-updated"));
    } catch (err) {
      console.error("Failed to remove saved college:", err);
    } finally {
      setRemovingCollegeId(null);
    }
  };

  if (error) return <p className="error">{error}</p>;

  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader-card">
          <div className="spinner"></div>
          <h3>{t("dashboard.loading")}</h3>
          <p>{t("dashboard.preparing", "Preparing your dashboard...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* ACTIONS */}
      <div className="dashboard-actions">
        <div className="notification">
          <Bell size={18} />
          {hasNotification && <span className="dot" />}
        </div>

        <button className="view-profile" onClick={() => navigate("/profile")}>
          {t("dashboard.view_profile")}
        </button>
      </div>

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>
          {t("dashboard.welcome_back")}, <span>{data.username}</span>!
        </h1>

        <p>{t("dashboard.continue_journey")}</p>

        <div className="user-plan" style={{ textTransform: "capitalize" }}>
          ⭐ {t("dashboard.current_plan", "Current Plan")}:{" "}
          <strong>{user?.plan || "Trial"}</strong>
        </div>
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
          <p>{t("dashboard.quiz_completions")}</p>
        </div>

        <div
          className="stat-card clickable"
          onClick={handleShowSaved}
          style={{ cursor: "pointer" }}
        >
          <div className="icon pink"><Bookmark /></div>
          <h2>{savedColleges.length}</h2>
          <p>{t("dashboard.saved_colleges")}</p>
        </div>

        <div className="stat-card">
          <div className="icon purple"><BookOpen /></div>
          <h2>{data.learningResourcesAccessed}</h2>
          <p>{t("dashboard.learning_resources_accessed")}</p>
        </div>

        <div className="stat-card">
          <div className="icon green"><Activity /></div>
          <h2>{data.activitiesLogged}</h2>
          <p>{t("dashboard.activities_logged")}</p>
        </div>

      </div>

      {showSavedModal && (
        <div className="saved-colleges-modal-backdrop" onClick={() => setShowSavedModal(false)}>
          <div className="saved-colleges-modal" onClick={(e) => e.stopPropagation()}>
            <div className="saved-modal-header">
              <div>
                <h3>{t("dashboard.saved_colleges")}</h3>
                <p>{savedColleges.length} {t("dashboard.saved_colleges")}</p>
              </div>
              <button className="modal-close" onClick={() => setShowSavedModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="saved-modal-body">
              {savedColleges.length === 0 ? (
                <div className="empty-state">
                  <p>{t("dashboard.no_saved_colleges")}</p>
                </div>
              ) : (
                savedColleges.map((college) => (
                  <div key={college.id} className="saved-college-item">
                    <div>
                      <h4>{college.name}</h4>
                      <p>{college.location || ""}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveSavedCollege(college.id)}
                      disabled={removingCollegeId === college.id}
                    >
                      <Trash2 size={16} />
                      {removingCollegeId === college.id ? t("dashboard.removing") : t("dashboard.remove")}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="saved-modal-footer">
              <button className="secondary-btn" onClick={() => navigate("/saved-colleges")}>
                {t("dashboard.view_full_saved_colleges")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROADMAP */}
      <div className="roadmap-card">
        <div className="roadmap-header">
          <h3>{t("dashboard.roadmap_preview")}</h3>
          <span className="link">
            {t("dashboard.explore_full_roadmap")} →
          </span>
        </div>

        <div className="roadmap-content">
          <Map size={40} />
          <h4>{t("dashboard.generate_first_roadmap")}</h4>

          <p>{t("dashboard.roadmap_description")}</p>

          <button className="primary-btn">
            {t("dashboard.generate_button")}
          </button>
        </div>
      </div>

      {/* PROGRESS */}
      <DashboardProgressSection
        weeklyProgress={data.weeklyProgress}
        recentActivity={data.recentActivity}
      />

    </div>
  );
}