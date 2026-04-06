import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useTranslation } from "react-i18next";

const AuthForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert(t("auth.loginSuccessful") + " " + userCredential.user.email);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert(t("auth.signUpSuccessful") + " " + userCredential.user.email);
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>{isLogin ? t("auth.signIn") : t("auth.signUp")}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t("auth.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder={t("auth.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          {isLogin ? t("auth.signIn") : t("auth.signUp")}
        </button>
      </form>
      <p style={{ marginTop: "10px", textAlign: "center" }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          onClick={() => setIsLogin(!isLogin)}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </span>
      </p>
    </div>
  );
};

export default AuthForm;
