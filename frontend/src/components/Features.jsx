import "../styles/features.css";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Sparkles,
  MapPin,
  Clock,
  Zap,
  BookOpen,
  Target,
} from "lucide-react";
import { useTranslation } from "react-i18next";

/* ---------------- DATA ---------------- */

const topFeatures = [
  {
    title: "3D Career Visualization",
    desc: "Interactive 3D maps to explore career paths and opportunities",
    icon: Sparkles,
    color: "cyan",
  },
  {
    title: "College Finder",
    desc: "Find the perfect colleges based on your preferences and career goals",
    icon: MapPin,
    color: "pink",
  },
  {
    title: "Personalized Domain Quiz",
    desc: "AI-driven assessment to discover your strengths and ideal career paths",
    icon: Clock,
    color: "purple",
  },
];

const bottomFeatures = [
  {
    title: "AI-Powered Insights",
    desc: "Get personalized recommendations based on your skills and interests",
    icon: Zap,
    color: "cyan",
  },
  {
    title: "Learning Resources",
    desc: "Access curated resources for entrance exams and skill development",
    icon: BookOpen,
    color: "pink",
  },
  {
    title: "AI Roadmap",
    desc: "Set and track academic and career goals with smart reminders",
    icon: Target,
    color: "purple",
  },
];

const whyChooseFeatures = [
  {
    title: "Clarity in Career Choices",
    desc: "Make confident decisions backed by AI-driven insights and data analysis",
    icon: Sparkles,
    color: "cyan",
  },
  {
    title: "Skill Development Guidance",
    desc: "Know exactly what skills to learn and when to learn them for maximum impact",
    icon: Zap,
    color: "pink",
  },
  {
    title: "Improved Employability",
    desc: "Prepare for the job market with targeted recommendations and resources",
    icon: BookOpen,
    color: "purple",
  },
  {
    title: "Personalized Experience",
    desc: "Every recommendation is tailored specifically to your unique profile",
    icon: Target,
    color: "cyan",
  },
];

/* ---------------- FEATURE CARD ---------------- */

const FeatureCard = ({ feature, index, size, t }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      className={`feature-card ${size}`}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{
        y: -10,
        scale: 1.03,
        transition: { duration: 0.3 },
      }}
    >
      <div className={`icon-wrap ${size} ${feature.color}`}>
        <Icon size={size === "large" ? 28 : 22} className="feature-icon" />
        <span className="icon-glow"></span>
      </div>

      {size === "large" ? (
        <>
          <h3>{t(feature.title)}</h3>
          <p>{t(feature.desc)}</p>
        </>
      ) : (
        <div className="text">
          <h4>{t(feature.title)}</h4>
          <p>{t(feature.desc)}</p>
        </div>
      )}
    </motion.div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */

const Features = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const { t } = useTranslation();

  return (
    <section className="features-page" ref={sectionRef}>
      {/* HEADING */}
      <motion.h1
        className="features-heading"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span>{t("Powerful Features")}</span> {t("for Your Future")}
      </motion.h1>

      <motion.p
        className="features-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {t(
          "Discover the tools and insights you need to make informed decisions about your career and education path."
        )}
      </motion.p>

      {/* TOP LARGE CARDS */}
      <div className="top-features">
        {topFeatures.map((f, i) => (
          <FeatureCard key={i} feature={f} index={i} size="large" t={t} />
        ))}
      </div>

      {/* BOTTOM SMALL CARDS */}
      <div className="bottom-features">
        {bottomFeatures.map((f, i) => (
          <FeatureCard key={i} feature={f} index={i} size="small" t={t} />
        ))}
      </div>

      {/* CTA */}
      <motion.div
        className="features-cta"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <motion.button
          className="explore-btn"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {t("Explore All Features")}
        </motion.button>
      </motion.div>

      {/* WHY CHOOSE CAREERPILOT */}
      <motion.div
        className="why-choose-section"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2 className="why-choose-heading">
          {t("Why Choose CareerPilot?")}
        </h2>

        <div className="why-choose-features">
          {whyChooseFeatures.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} size="small" t={t} />
          ))}
        </div>
      </motion.div>

      {/* NEW CTA SECTION */}
      <motion.div
        className="career-cta"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <h2>
          {t("Ready to Discover Your")} <span>{t("Career Path")}</span>?
        </h2>
        <p>
          {t(
            "Join thousands of students who've already found their direction with CareerPilot."
          )}
        </p>
        <div className="cta-buttons">
          <button className="get-started-btn">{t("Get Started Free →")}</button>
          <button className="explore-features-btn">{t("Explore Features")}</button>
        </div>
      </motion.div>
    </section>
  );
};

export default Features;