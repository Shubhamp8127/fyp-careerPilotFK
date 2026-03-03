import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import "../styles/forgot.css";
import apiClient from "../services/apiClient";
import { Link } from "react-router-dom";
import forgotImg from "../assets/forgot.png";
import forgotImgDark from "../assets/forgot-dark.png";
import checkImg from "../assets/check.png";
import checkImgDark from "../assets/check-dark.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode dynamically
  useEffect(() => {
    const updateDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark"));
    };

    updateDarkMode();
    // Optional: listen for class changes if using a toggle
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post(
        "/api/auth/forgot-password",
        { email },
        { skipAuthRefresh: true }
      );

      toast.success(res.data.message || "Reset link sent!");
      setSent(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      {!sent ? (
        <div className="forgot-container">
          <img
            src={isDarkMode ? forgotImgDark : forgotImg}
            alt="forgot"
            className="forgot-img"
          />

          <h2>Forgot your password?</h2>
          <p className="forgot-sub">
            Enter your email so we can send you a password reset link
          </p>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="e.g. username@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Email"}
            </button>
          </form>

          <Link to="/signin" className="back-link">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      ) : (
        <div className="forgot-container">
          <img
            src={isDarkMode ? checkImgDark : checkImg}
            alt="email sent"
            className="forgot-img"
          />

          <h2>Check your email!</h2>

          <p className="forgot-sub">
            We've sent a reset link to <b>{email}</b>. Please check your inbox and follow the instructions.
          </p>

          <button
            className="primary-btn"
            onClick={() => window.open("https://mail.google.com", "_blank")}
          >
            Open Email Inbox
          </button>

          <div className="resend-link" onClick={() => setSent(false)}>
            <ArrowLeft size={14} /> Resend email
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
