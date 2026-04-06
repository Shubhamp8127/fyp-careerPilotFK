import "../styles/CollegeCard.css";
import { Heart, MapPin, Bookmark } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

const CollegeCard = ({ college, toggleCompare, compareList, onViewDetails }) => {
  const { t } = useTranslation();
  const [bookmarked, setBookmarked] = useState(false);
  const isSelected = compareList?.some(c => c.id === college.id);

  // ✅ fetch bookmark status from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedColleges")) || [];
    const initialBookmarked = college.saved ?? saved.includes(college.id);
    setBookmarked(initialBookmarked);
  }, [college.id, college.saved]);

  // 🔖 toggle bookmark via backend API
  const toggleBookmark = async () => {
    try {
      const res = await apiClient.post("/api/colleges/bookmark", {
        collegeId: college.id,
      });

      const data = res.data;

      // ✅ Update state from backend response
      setBookmarked(data.saved);

      // ✅ Update localStorage based on backend response
      const saved = JSON.parse(localStorage.getItem("savedColleges")) || [];
      let updated;
      if (data.saved) {
        // saved now → add if not present
        updated = saved.includes(college.id) ? saved : [...saved, college.id];
      } else {
        // unsaved now → remove if present
        updated = saved.filter((id) => id !== college.id);
      }
      localStorage.setItem("savedColleges", JSON.stringify(updated));

      // 🔥 trigger dashboard update
      window.dispatchEvent(new Event("saved-colleges-updated"));
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
    }
  };

  return (
    <div className="college-card">
      <div className="card-top">
        <h3>{college.name}</h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <Bookmark
            size={18}
            className={`bookmark-icon ${bookmarked ? "filled" : ""}`}
            fill={bookmarked ? "currentColor" : "none"}
            onClick={toggleBookmark}
          />
          <Heart size={18} className="heart-icon" />
        </div>
      </div>

      <p className="location">
        <MapPin size={14} /> {college.location}
      </p>

      <div className="meta">
        <span className={`badge ${(college.type || "private").toLowerCase()}`}>
          {college.type || "Private"}
        </span>
        <span className="rating">⭐ {college.rating || 4.0}</span>
        <span className="est">{t("collegeCard.est", "Est.")} {college.est || "N/A"}</span>
      </div>

      <div className="stats">
        <div>
          <p className="label">{t("collegeCard.annualFees", "Annual Fees")}</p>
          <p className="value">₹ {(college.fees || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="label">{t("collegeCard.cutoff", "Cutoff")}</p>
          <p className="cutoff">{college.cutoff || "N/A"}</p>
        </div>
      </div>

      <div className="courses">
        <p className="label">{t("collegeCard.popularCourses", "Popular Courses")}</p>
        <div className="course-tags">
          {(college.courses || []).slice(0, 3).map((c, i) => (
            <span key={i}>{c}</span>
          ))}
          {(college.courses?.length || 0) > 3 && (
            <span>
              +{college.courses.length - 3} {t("collegeCard.more", "more")}
            </span>
          )}
        </div>
      </div>

      <div className="actions">
        <button 
  className="link"
  onClick={() => onViewDetails?.(college)}
>
  {t("collegeCard.viewDetails", "View Details")}
</button>
        <a href={college.website} target="_blank" rel="noreferrer">
          <button className="visit">{t("collegeCard.visit", "Visit")} ↗</button>
        </a>
        <button
        className={`compare ${isSelected ? "active" : ""}`}
        onClick={() => toggleCompare(college)}
      >
        {isSelected
          ? t("collegeCard.selected", "Selected")
          : t("collegeCard.compare", "Compare")}
          </button>
      </div>
    </div>
  );
};

export default CollegeCard;