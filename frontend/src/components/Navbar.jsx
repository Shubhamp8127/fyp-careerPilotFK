import "../styles/navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import apiClient, { clearSession } from "../services/apiClient";

import { useTheme } from "../contexts/ThemeContext";

import {
  ChevronDown,
  Settings,
  Globe,
  Menu,
  X,
  Home,
  Sparkles,
  School,
  CreditCard,
  Brain,
  Bot,
  LayoutDashboard,
  Briefcase,
  GitBranch,
  BookOpen,
  Moon,
  Sun,
  LogOut
} from "lucide-react";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage =
    location.pathname === "/signin" || location.pathname === "/register";

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const userDisplayName =
  user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`
    : user?.email || "User";

  const dropdownRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setUserMenuOpen(false);
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout", {}, { skipAuthRefresh: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearSession();
      setUser(null);
      toast.success(t("Logged out successfully 👋"));
      navigate("/");
    }
  };

  const closeMenuAndNavigate = (path, needsAuth) => {
    if (needsAuth && !user) {
      navigate("/signin");
      return;
    }
    navigate(path);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo-container">
          <Menu
            size={22}
            className="hamburger-icon"
            onClick={() => setSidebarOpen(true)}
          />

          <div className="brand" onClick={() => navigate("/")}>
            <div className="logo-badge">CP</div>
            <div className="logo-text">
              <span>{t("Career")}</span>
              <span>{t("Pilot")}</span>
            </div>
          </div>
        </div>

        <div className="nav-right">
          {user && (
            <button
              className="btn-dashboard"
              onClick={() => navigate("/dashboard")}
            >
              <Settings size={16} />
              {t("Dashboard")}
            </button>
          )}

          {user && (
            <div className="language-switcher" ref={dropdownRef}>
              <button
                className="language-btn-next"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Globe size={16} />
                {currentLanguage.label}
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <ul className="language-dropdown-next">
                  {languages.map((lang) => (
                    <li
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setDropdownOpen(false);
                      }}
                    >
                      {lang.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="nav-buttons">
            {!user ? (
              <>
                <button
                  className="btn-login"
                  onClick={() => navigate("/signin")}
                >
                  {t("Sign In")}
                </button>
                <button
                  className="btn-signup"
                  onClick={() => navigate("/register")}
                >
                  {t("Sign Up")}
                </button>
              </>
            ) : (
              <div className="user-dropdown" ref={userRef}>
                <button
                  className="user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  {userDisplayName}
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div className="user-menu">
                    <button onClick={() => navigate("/profile")}>
                      {t("Profile")}
                    </button>
                    <button onClick={handleLogout}>{t("Logout")}</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= SIDEBAR ================= */}

      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Top */}
        <div className="sidebar-top">
          <div className="brand" onClick={() => navigate("/")}>
            <div className="logo-badge">CP</div>
            <div className="logo-text">
              <span>{t("Career")}</span>
              <span>{t("Pilot")}</span>
            </div>
          </div>
          <X size={18} onClick={() => setSidebarOpen(false)} />
        </div>


        {user && (
          <>
            <div className="sidebar-user">
              
              {/* Avatar */}
              <div className="sidebar-user-avatar">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="profile"
                  />
                ) : (
                  user.first_name
                    ? user.first_name.charAt(0).toUpperCase()
                    : "U"
                )}
              </div>

              {/* User Info */}
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">
                  {user.first_name
                    ? `${user.first_name} ${user.last_name || ""}`
                    : "User"}
                </div>
                <div className="sidebar-user-email">
                  {user.email}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="sidebar-divider"></div>
          </>
        )}

        {/* NAVIGATION */}
<p className="sidebar-section navigation-title">{t("NAVIGATION")}</p>

<div
  className={`sidebar-item ${
    location.pathname === "/" ? "active" : ""
  }`}
  onClick={() => closeMenuAndNavigate("/")}
>
  <Home size={18} />
  <span>{t("Home")}</span>
</div>

{user && (
  <div
    className={`sidebar-item ${
      location.pathname === "/dashboard" ? "active" : ""
    }`}
    onClick={() => closeMenuAndNavigate("/dashboard")}
  >
    <LayoutDashboard size={18} />
    <span>{t("Dashboard")}</span>
  </div>
)}

        

        {/* QUICK ACCESS */}
        {user && (
          <>
            <p className="sidebar-section">{t("QUICK ACCESS")}</p>

            <div
              className={`sidebar-item ${
                location.pathname === "/career-quiz" ? "active" : ""
              }`}
              onClick={() => navigate("/career-quiz")}
            >
              <Brain size={18} />
              <span>{t("Career Quiz")}</span>
            </div>

            <div
              className={`sidebar-item ${
                location.pathname === "/college-finder" ? "active" : ""
              }`}
              onClick={() => navigate("/colleges")}
            >
              <School size={18} />
              <span>{t("College Finder")}</span>
            </div>

            <div
              className={`sidebar-item ${
                location.pathname === "/ai-roadmap" ? "active" : ""
              }`}
              onClick={() => navigate("/ai-roadmap")}
            >
              <Bot size={18} />
              <span>{t("AI Roadmap")}</span>
            </div>

            <div
              className={`sidebar-item ${
                location.pathname === "/job-hunting" ? "active" : ""
              }`}
              onClick={() => navigate("/job-hunting")}
            >
              <Briefcase size={18} />
              <span>{t("Resume Analyzer")}</span>
            </div>

            <div
              className={`sidebar-item ${
                location.pathname === "/career-tree" ? "active" : ""
              }`}
              onClick={() => navigate("/career-tree")}
            >
              <GitBranch size={18} />
              <span>{t("Graphical Career Overview")}</span>
            </div>

            <div
              className={`sidebar-item ${
                location.pathname === "/resources" ? "active" : ""
              }`}
              onClick={() => navigate("/resources")}
            >
              <BookOpen size={18} />
              <span>{t("Learning Resources")}</span>
            </div>

            <div
              className={`sidebar-item ${
                location.pathname === "/subscription" ? "active" : ""
              }`}
              onClick={() => navigate("/subscription")}
            >
              <CreditCard size={18} />
              <span>{t("Subscription")}</span>
            </div>
          </>
        )}

        {/* ✅ DARK MODE TOGGLE */}
        <p className="sidebar-section">{t("APPEARANCE")}</p>
        <div className="theme-toggle-container">
          <div className="theme-left">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? t("Light mode") : t("Dark mode")}</span>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* ACCOUNT SECTION */}
        {user && (
          <>
            <p className="sidebar-section">{t("ACCOUNT")}</p>

            <div
              className="sidebar-item"
              onClick={() => navigate("/profile")}
            >
              <Settings size={18} />
              <span>{t("Settings")}</span>
            </div>

            <div className="sidebar-item logout" onClick={handleLogout}>
              <LogOut size={18} style={{ color: "#EF4444" }} />
              <span>{t("Logout")}</span>
            </div>
          </>
        )}

        {!user && (
          <div className="sidebar-bottom">
            <button
              className="sidebar-signin"
              onClick={() => navigate("/signin")}
            >
              {t("Sign In")}
            </button>

            <button
              className="sidebar-signup"
              onClick={() => navigate("/register")}
            >
              {t("Sign Up Free")}
            </button>
          </div>
        )}
      </div>
    </>
    
  );
  
};

export default Navbar;
