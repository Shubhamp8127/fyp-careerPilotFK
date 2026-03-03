import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, ShieldCheck, CreditCard, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { useTranslation } from "react-i18next";
import "../styles/SimplePricingPage.css";
import Footer from "../components/Footer";

const plans = [
  {
    id: "basic",
    name: "basic_plan",
    description: "basic_plan_desc",
    monthly: 9.99,
    quarterly: 24.99,
    features: [
      "ai_career_chatbot",
      "basic_career_assessment",
      "college_database_access",
      "email_support",
    ],
    icon: Star,
    color: "blue",
  },
  {
    id: "premium",
    name: "premium_plan",
    description: "premium_plan_desc",
    monthly: 19.99,
    quarterly: 49.99,
    features: [
      "everything_in_basic",
      "ai_roadmap_generator",
      "unlimited_roadmaps",
      "priority_support",
    ],
    icon: Zap,
    color: "purple",
    popular: true,
  },
  {
    id: "elite",
    name: "elite_plan",
    description: "elite_plan_desc",
    monthly: 39.99,
    quarterly: 99.99,
    features: [
      "everything_in_premium",
      "chatgpt_gemini_pro",
      "brock_ai_assistant",
      "support_247",
    ],
    icon: Crown,
    color: "gold",
  },
];

export default function SimplePricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubscribe = (planId) => {
    alert(`${t("Subscribe to")} ${t(planId)} – ${t("payment coming soon")}`);
  };

  return (
    <div className="pricing-page">
      <div className="pricing-container">
        {/* HEADER */}
        <div className="pricing-header">
          <h1>
            {t("Unlock Your")} <span>{t("Career Potential")}</span>
          </h1>
          <p>
            {t(
              "From personalized AI guidance to advanced career roadmaps, choose the perfect plan to accelerate your professional growth"
            )}
          </p>

          {/* BILLING TOGGLE */}
          <div className="billing-toggle">
            <button
              className={billingCycle === "monthly" ? "active" : ""}
              onClick={() => setBillingCycle("monthly")}
            >
              {t("Monthly")}
            </button>

            <button
              className={billingCycle === "quarterly" ? "active" : ""}
              onClick={() => setBillingCycle("quarterly")}
            >
              {t("Quarterly")}
              <span className="save-badge">{t("Save 25%")}</span>
            </button>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="pricing-grid">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = plan[billingCycle];
            const savings =
              billingCycle === "quarterly"
                ? plan.monthly * 3 - plan.quarterly
                : 0;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`pricing-card ${plan.popular ? "popular" : ""}`}
              >
                {plan.popular && (
                  <div className="popular-badge">{t("Most Popular")}</div>
                )}

                <div className={`plan-icon ${plan.color}`}>
                  <Icon size={32} />
                </div>

                <h3>{t(plan.name)}</h3>
                <p className="plan-desc">{t(plan.description)}</p>

                <div className="price-box">
                  <span className="price">${price.toFixed(2)}</span>
                  <span className="cycle">
                    /{billingCycle === "quarterly" ? t("3 months") : t("month")}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="savings">
                    {t("Save")} ${savings.toFixed(2)} ({t("25% off")})
                  </div>
                )}

                <div className="features">
                  {plan.features.map((f, i) => (
                    <div key={i} className="feature">
                      <span className={`check ${plan.color}`}>
                        <Check size={12} />
                      </span>
                      {t(f)}
                    </div>
                  ))}
                </div>

                <button
                  className={`subscribe-btn ${plan.popular ? "primary" : ""}`}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {t("Get Started")}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* =================== FREE TRIAL SECTION =================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="free-trial-card"
        >
          <h3 className="free-title">{t("Try Free First")}</h3>
          <p className="free-desc">
            {t("Explore our platform with limited access to all features")}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Check size={16} className="text-neon-cyan" />
              <span className="text-gray-300 text-sm">
                {t("Limited AI Career Chatbot (10 messages/day)")}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Check size={16} className="text-neon-cyan" />
              <span className="text-gray-300 text-sm">{t("Sample Learning Resources")}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check size={16} className="text-neon-cyan" />
              <span className="text-gray-300 text-sm">{t("Basic Career Assessment Quiz")}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check size={16} className="text-neon-cyan" />
              <span className="text-gray-300 text-sm">{t("Basic Dashboard")}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check size={16} className="text-neon-cyan" />
              <span className="text-gray-300 text-sm">{t("View College Database (Limited)")}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/auth/signup")}
            className="start-free-btn"
          >
            {t("Start Free Trial")}
          </button>
        </motion.div>

        {/* =================== TRUST & FAQ SECTION =================== */}
        <motion.div
          className="trust-faq-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          {/* TRUST ICONS */}
          <div className="trust-icons">
            <div className="trust-item">
              <div className="icon-circle green">
                <ShieldCheck size={24} />
              </div>
              <h4>{t("Secure Payments")}</h4>
              <p>{t("Enterprise-grade security with SSL encryption")}</p>
            </div>
            <div className="trust-item">
              <div className="icon-circle blue">
                <CreditCard size={24} />
              </div>
              <h4>{t("Flexible Billing")}</h4>
              <p>{t("Cancel anytime, no hidden fees")}</p>
            </div>
            <div className="trust-item">
              <div className="icon-circle purple">
                <Clock size={24} />
              </div>
              <h4>{t("30-Day Guarantee")}</h4>
              <p>{t("Full refund if you're not satisfied")}</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="faq-section">
            <h3>{t("Frequently Asked Questions")}</h3>
            <div className="faq-grid">
              <div className="faq-item">
                <h5>{t("Can I upgrade or downgrade anytime?")}</h5>
                <p>{t("Yes, you can change your plan at any time. Upgrades are immediate, and downgrades take effect at the next billing cycle.")}</p>
              </div>
              <div className="faq-item">
                <h5>{t("What payment methods do you accept?")}</h5>
                <p>{t("We accept all major credit cards, debit cards, and digital wallets through Stripe and Razorpay.")}</p>
              </div>
              <div className="faq-item">
                <h5>{t("Is there a free trial?")}</h5>
                <p>{t("Yes, you can try our platform for free with limited features. No credit card required for the free tier.")}</p>
              </div>
              <div className="faq-item">
                <h5>{t("What's included in Elite Plan AI models?")}</h5>
                <p>{t("Elite members get access to ChatGPT-5, Gemini Pro, and our specialized Brock AI career coach for personalized guidance.")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}