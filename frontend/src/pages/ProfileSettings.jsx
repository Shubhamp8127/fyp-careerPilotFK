import { useState, useEffect, useRef } from "react";
import {
  User,
  Shield,
  Bell,
  Palette,
  Save,
  Camera,
  Eye,
  EyeOff,
  Lock,
  Globe, 
  ChevronDown,
  Sun,      // ✅ Add this
  Moon,
  Check,
  X
} from "lucide-react";
import '../styles/profileSettings.css';
import apiClient from "../services/apiClient";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useTheme } from "../contexts/ThemeContext";


export default function ProfileSettings({ userProfile, onUpdate }) {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();

  const avatarOptions = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png"
];

  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false); // popup open/close


  const [profileData, setProfileData] = useState({
    first_name: userProfile?.first_name || "",
    last_name: userProfile?.last_name || "",
    email: userProfile?.email || "",
    avatar_url: userProfile?.avatar_url || "",
  });

  const handleAvatarSelect = (url) => {
  setProfileData({ ...profileData, avatar_url: url }); // update avatar
  setShowAvatarPicker(false); // close picker
  toast.success("Avatar selected!");
};

const handleAvatarPreview = (url) => {
  setProfileData((prev) => ({
    ...prev,
    avatar_url: url,
  }));
};

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const [notifications, setNotifications] = useState({
    Email_Notifications: true,
    Push_Notifications: true,
    Marketing_Emails: false,
    Security_Alerts: true,
  });

const [preferences, setPreferences] = useState({
  theme: localStorage.getItem("theme") || "dark",
  language: localStorage.getItem("language") || "en",
  timezone: "UTC",
  currency: localStorage.getItem("currency") || "USD",
});

// Language dropdown state & ref
const [langDropdownOpen, setLangDropdownOpen] = useState(false);
const langDropdownRef = useRef(null);

// Language options
const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
];

// Current language based on preferences
const currentLanguage =
  languages.find((lang) => lang.code === preferences.language) || languages[0];

  const sections = [
    { id: "profile", label: "Profile Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  

  const handleProfileUpdate = async () => {
  if (!profileData.first_name || !profileData.last_name) {
    toast.error("First & last name are required");
    return;
  }

  try {
    setLoading(true);

    const { data } = await apiClient.put(
      "/api/auth/update-profile",
      {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        avatar: profileData.avatar_url,
      }
    );

    toast.success("Profile updated successfully!");

    // 🔥 IMPORTANT — send backend updated user
    if (onUpdate) {
      onUpdate(data.user);
    }

    // Update local profileData with the saved data
    setProfileData({
      first_name: data.user.first_name || "",
      last_name: data.user.last_name || "",
      email: data.user.email || "",
      avatar_url: data.user.avatar_url || "",
    });

  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
  } finally {
    setLoading(false);
  }
};

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("At least 8 characters");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("One number");
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("One special character (@$!%*?&)");
    }
    return errors;
  };

  const checkPasswordRules = (password) => {
    const rules = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
    setPasswordRules(rules);
    return rules;
  };

  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    checkPasswordRules(password);
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    const allRulesPassed = Object.values(passwordRules).every(rule => rule);
    if (!allRulesPassed) {
      toast.error("Please meet all password requirements!");
      return;
    }
    try {
      setLoading(true);
      await apiClient.put("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password updated successfully! 🎉");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordRules({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsUpdate = () => {
    toast.success("Notification preferences updated!");
  };

const handlePreferencesUpdate = async () => {
  try {
    setLoading(true);

      // save theme - handle system preference
      if (preferences.theme === "system") {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        localStorage.setItem("theme", isSystemDark ? "dark" : "light");
      } else {
        localStorage.setItem("theme", preferences.theme);
      }
    // ✅ save language
    localStorage.setItem("language", preferences.language);

    toast.success("Preferences updated!");
  } catch (error) {
    toast.error("Update failed");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    
  if (userProfile) {
    setProfileData({
      first_name: userProfile.first_name || "",
      last_name: userProfile.last_name || "",
      email: userProfile.email || "",
      avatar_url: userProfile.avatar_url || "",
    });
     const savedTheme = localStorage.getItem("theme") || userProfile?.themePreference || "system";
    setPreferences(prev => ({ ...prev, theme: savedTheme }));
  }
}, [userProfile]);

const fullName =
  [profileData.first_name, profileData.last_name]
    .filter(Boolean)
    .join(" ") || "CareerPilot Member";

    

 return (
  <div className="profile-page">
    

    {/* Top Card */}
    <div className="profile-header-card">
      <div className="profile-header-left">
        <div className="profile-avatar-large">
          {profileData.avatar_url ? (
            <img
              src={profileData.avatar_url}
              alt="profile"
              className="avatar-img"
            />
          ) : (
            <>
              {profileData.first_name?.[0]}
              {profileData.last_name?.[0]}
            </>
          )}
        </div>
        <div>
          <h2>{fullName}</h2>
          <p className="member-text">
            {profileData.email}
          </p>
          <p className="member-text">CareerPilot Member</p>
        </div>
      </div>

      <button className="edit-profile-btn">
        Edit Profile
      </button>
    </div>

    {/* Tabs */}
    <div className="profile-tabs">
      {sections.map((sec) => (
        <button
          key={sec.id}
          className={activeSection === sec.id ? "active" : ""}
          onClick={() => setActiveSection(sec.id)}
        >
          <sec.icon size={16} />
          {sec.label}
        </button>
      ))}
    </div>

    {/* Main Card */}
    <div className="profile-main-card">
      {activeSection === "profile" && (
        <>
          <h3 className="card-title">PROFILE INFO</h3>

          <div className="profile-content">
            {/* Left Avatar */}
            <div className="profile-left">
              <div className="profile-avatar">
                <img
                  src={profileData.avatar_url || "/default-avatar.png"}
                  alt="avatar"
                  className="avatar-img"
                />
                <button
                  className="camera-btn"
                  onClick={() => setShowAvatarPicker(true)}
                >
                  <Camera size={14} />
                </button>
              </div>

              <button
                className="upload-btn"
                onClick={() => setShowAvatarPicker(true)}
              >
                Upload
              </button>

              {/* Avatar Picker Modal */}
              {showAvatarPicker && (
                <div className="avatar-modal">
                  <h4>Select your avatar</h4>
                  <div className="avatar-options">
                    {avatarOptions.map((url) => (
                      <img
                        key={url}
                        src={url}
                        alt="avatar option"
                        className={`avatar-option ${profileData.avatar_url === url ? "selected" : ""}`}
                        onClick={() => handleAvatarPreview(url)}
                      />
                    ))}
                  </div>
                  <button
                  className="save-avatar-btn"
                  onClick={() => {
                    toast.success("Avatar selected!");
                    setShowAvatarPicker(false);
                  }}
                >
                  Save
                </button>
                </div>
              )}
            </div>

            {/* Right Form */}
            <div className="profile-right">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={profileData.first_name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, first_name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={profileData.last_name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, last_name: e.target.value })
                  }
                />
              </div>

              <div className="form-group full-width">
                <label>Email</label>
                <input type="email" value={profileData.email} readOnly />
              </div>

              <div className="save-wrapper">
                <button
                  onClick={handleProfileUpdate}
                  className="save-btn"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </>
)}

{/* Security */}
{activeSection === "security" && (
          <>
            <div className="form-grid">
              <div>
                <label>Current Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label>New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="password-rules">
              <h4>Password Requirements:</h4>
              <ul>
                <li className={passwordRules.length ? "valid" : "invalid"}>
                  {passwordRules.length ? <Check size={14} /> : <X size={14} />}
                  At least 8 characters
                </li>
                <li className={passwordRules.lowercase ? "valid" : "invalid"}>
                  {passwordRules.lowercase ? <Check size={14} /> : <X size={14} />}
                  One lowercase letter (a-z)
                </li>
                <li className={passwordRules.uppercase ? "valid" : "invalid"}>
                  {passwordRules.uppercase ? <Check size={14} /> : <X size={14} />}
                  One uppercase letter (A-Z)
                </li>
                <li className={passwordRules.number ? "valid" : "invalid"}>
                  {passwordRules.number ? <Check size={14} /> : <X size={14} />}
                  One number (0-9)
                </li>
                <li className={passwordRules.special ? "valid" : "invalid"}>
                  {passwordRules.special ? <Check size={14} /> : <X size={14} />}
                  One special character (@$!%*?&)
                </li>
              </ul>
            </div>
            <div className="form-actions">
              <button type="button" onClick={handlePasswordChange} disabled={loading}>
                <Lock size={16} /> Update Password
              </button>
            </div>
          </>
        )}

        {/* Notifications */}
        {activeSection === "notifications" && (
          <>
            {Object.keys(notifications).map((key) => (
              <div key={key} className="notification-item">
                <div>{key.replace("_", " ")}</div>
                <button
                  onClick={() =>
                    setNotifications({ ...notifications, [key]: !notifications[key] })
                  }
                  className={`toggle-btn ${
                    notifications[key] ? "on" : "off"
                  }`}
                >
                  <div className="toggle-circle" />
                </button>
              </div>
            ))}
            <div className="form-actions">
              <button onClick={handleNotificationsUpdate}>
                <Save size={16} /> Save Preferences
              </button>
            </div>
          </>
        )}

        {activeSection === "preferences" && (
  <>
    <div className="preferences-grid">

      {/* THEME CARD */}
      <div className="preference-card">
        <h4>Appearance</h4>
        <p>Customize your theme</p>

        <div className="theme-toggle-container">
          <div className="theme-left">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
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
      </div>

      {/* LANGUAGE CARD */}
      <div className="preference-card">
        <h4>Language</h4>
        <p>Select your preferred language</p>

        <div
          className="language-switcher"
          onClick={() => setLangDropdownOpen(!langDropdownOpen)}
        >
          <Globe size={18} />
          <span>{currentLanguage.label}</span>
          <ChevronDown size={14} style={{ marginLeft: "auto" }} />
        </div>

        {langDropdownOpen && (
          <div className="language-dropdown">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className="dropdown-item"
                onClick={() => {
                  setPreferences({ ...preferences, language: lang.code });
                  i18n.changeLanguage(lang.code);
                  setLangDropdownOpen(false);
                }}
              >
                {lang.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TIMEZONE CARD */}
      <div className="preference-card">
        <h4>Timezone</h4>
        <p>Select your timezone</p>
        <select
          value={preferences.timezone}
          onChange={(e) =>
            setPreferences({ ...preferences, timezone: e.target.value })
          }
        >
          <option value="UTC">UTC</option>
          <option value="Asia/Kolkata">India Standard Time</option>
        </select>
      </div>

      {/* CURRENCY CARD */}
      <div className="preference-card">
        <h4>Currency</h4>
        <p>Select your currency</p>
        <select
          value={preferences.currency}
          onChange={(e) =>
            setPreferences({ ...preferences, currency: e.target.value })
          }
        >
          <option value="USD">USD ($)</option>
          <option value="INR">INR (₹)</option>
        </select>
      </div>

    </div>

    <div className="form-actions">
      <button onClick={handlePreferencesUpdate}>
        <Save size={16} /> Save Preferences
      </button>
    </div>
  </>
)}
    </div>
    
  </div>
  );
}
