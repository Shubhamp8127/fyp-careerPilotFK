import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Eye,
  EyeOff,
  ArrowLeft,
  Lock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  RefreshCcw,
  KeyRound,

 } from "lucide-react";
import "../styles/reset.css";
import apiClient from "../services/apiClient";
import ResetImg from "../assets/reset.png";
import ResetImgDark from "../assets/reset-dark.png";
import SuccessImg from "../assets/password-success.png";
import SuccessImgDark from "../assets/password-success-dark.png";


const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [expired, setExpired] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= DARK MODE DETECTION ================= */

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      const darkMode =
        document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark");

      setIsDark(darkMode);
    };

    checkDark(); // initial check

    window.addEventListener("storage", checkDark);
    window.addEventListener("click", checkDark);

    return () => {
      window.removeEventListener("storage", checkDark);
      window.removeEventListener("click", checkDark);
    };
  }, []);


  /* ================= VERIFY TOKEN ON LOAD ================= */

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await apiClient.post(
          `/api/auth/reset-password/${token}`,
          { password: "temporary-check-password-123!" },
          { skipAuthRefresh: true }
        );
      } catch (err) {
        const message =
          err.response?.data?.message || "Invalid or expired link";

        if (message.toLowerCase().includes("expired")) {
          setExpired(true);
          setMsg("Reset link expired. Please request a new one.");
        }
      }
    };

    if (token) verifyToken();
  }, [token]);

  /* ================= PASSWORD STRENGTH ================= */

  const getStrength = () => {
    let score = 0;

    if (!password) return { score: 0, label: "", color: "#e5e7eb" };

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score <= 2) return { score: 30, label: "Weak", color: "#ef4444" };
    if (score <= 4) return { score: 60, label: "Medium", color: "#facc15" };
    if (score <= 5) return { score: 80, label: "Strong", color: "#3b82f6" };
    return { score: 100, label: "Excellent", color: "#22c55e" };
  };

  const strength = getStrength();
  const passwordsMatch = confirm && password === confirm;

  /* ================= PASSWORD RULES ================= */

  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };


  /* ================= SUBMIT HANDLER ================= */


  const submitHandler = async (e) => {
    e.preventDefault();

    if (!Object.values(rules).every(Boolean)) {
    setMsg("Password does not meet all requirements");
    return;
    }
    
    if (password !== confirm) {
      setMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post(
        `/api/auth/reset-password/${token}`,
        { password },
        { skipAuthRefresh: true }
      );

      setSuccess(true); // 👈 success screen show
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid or expired link";

      if (message.toLowerCase().includes("expired")) {
        setExpired(true);
      }

      setMsg(message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUCCESS SCREEN ================= */

  if (success) {
    return (
      <div className="success-wrapper">

        <div className="success-card">
          <img src={isDark ? SuccessImgDark : SuccessImg}  alt="success" 
           />

          <h2>Password changed!</h2>

          <p>
            You've successfully completed your password reset.
          </p>

          <button
            className="login-btn"
            onClick={() => navigate("/signin")}
          >
            Log in Now
          </button>
        </div>

      </div>
    );
  }

  /* ================= RESET FORM UI ================= */

  return (
    <div className="reset-container">

      <div className="reset-img">
        <img src={isDark ? ResetImgDark : ResetImg} alt="reset" />
      </div>

      <h2>Reset Password</h2>

      {expired ? (
        <div className="expired-box">
          <p className="error-text">{msg}</p>

          <Link to="/forgot-password" className="new-link-btn">
            Request New Link
          </Link>
        </div>
      ) : (
        <>
          <p className="reset-sub">
            Please kindly set your new password
          </p>

          <form onSubmit={submitHandler}>

            <label className="input-label">New password</label>
            <div className="input-group">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setShow(!show)}>
                {show ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
            </div>

            {password && (
              <>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${strength.score}%`,
                      background: strength.color,
                      transition: "0.3s ease"
                    }}
                  />
                </div>

                <div className="strength-text">
                  Password strength{" "}
                  <span style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>

                  {/* ================= PASSWORD RULES UI ================= */}

                {password && (
                  <ul className="password-rules">
                    <li className={rules.length ? "done" : ""}>
                      <span className="rule-icon">
                        {rules.length ? "✔" : "•"}
                      </span>
                      At least 8 characters
                    </li>

                    <li className={rules.uppercase ? "done" : ""}>
                      <span className="rule-icon">
                        {rules.uppercase ? "✔" : "•"}
                      </span>
                      One uppercase letter
                    </li>

                    <li className={rules.lowercase ? "done" : ""}>
                      <span className="rule-icon">
                        {rules.lowercase ? "✔" : "•"}
                      </span>
                      One lowercase letter
                    </li>

                    <li className={rules.number ? "done" : ""}>
                      <span className="rule-icon">
                        {rules.number ? "✔" : "•"}
                      </span>
                      One number
                    </li>

                    <li className={rules.special ? "done" : ""}>
                      <span className="rule-icon">
                        {rules.special ? "✔" : "•"}
                      </span>
                      One special character
                    </li>
                  </ul>
                )}
              </>
            )}

            <label className="input-label">Re-enter password</label>
            <input
              className={`simple-input ${
                confirm
                  ? passwordsMatch
                    ? "match"
                    : "not-match"
                  : ""
              }`}
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            {confirm && !passwordsMatch && (
              <p className="error-text">Passwords do not match</p>
            )}

            {confirm && passwordsMatch && (
              <p className="success-text">Passwords match</p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Reset Password"}
            </button>

            {msg && !expired && (
              <p className="msg">{msg}</p>
            )}

            <Link to="/signin" className="back-link">
              <ArrowLeft size={16} />
              Back to Sign in
            </Link>

          </form>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
