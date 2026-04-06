import "../styles/stats.css";
import { useRef } from "react";
import useScrollAnimation from "../hooks/useScrollAnimation";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const { t } = useTranslation();
  const statsRef = useRef();
  useScrollAnimation(statsRef);

  return (
    <section ref={statsRef} className="stats scroll-hidden">
      <div className="stat-box">
        <h2>10K+</h2>
        <p>{t("stats.studentsGuided")}</p>
      </div>

      <div className="stat-box">
        <h2>500+</h2>
        <p>{t("stats.careerPaths")}</p>
      </div>

      <div className="stat-box">
        <h2>1000+</h2>
        <p>{t("stats.collegesListed")}</p>
      </div>
    </section>
  );
};

export default Stats;
