import { useEffect, useState } from "react";
import "../styles/colleges.css";
import CollegeCard from "../components/CollegeCard";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import apiClient from "../services/apiClient";

// Lucide React icons
import { Filter, ChevronDown, X, Search } from "lucide-react";

// Framer Motion
import { motion, AnimatePresence } from "framer-motion";

const Colleges = () => {
  const { t } = useTranslation();

  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Filter states
  const [sortBy, setSortBy] = useState("rating");
  const [type, setType] = useState("All");
  const [stateFilter, setStateFilter] = useState("All States");
  const [courseFilter, setCourseFilter] = useState("All Courses"); // ✅ Course filter
  // 🔥 Compare states
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  // Fetch colleges
  useEffect(() => {
    let active = true;

    apiClient
      .get("/api/colleges")
      .then((res) => {
        if (active) setColleges(res.data || []);
      })
      .catch((err) => console.error(err));

    return () => {
      active = false;
    };
  }, []);

  // Helper: Map location to state
  const getStateFromLocation = (location) => {
    const map = {
      "New Delhi": "Delhi",
      "Mumbai": "Maharashtra",
      "Chennai": "Tamil Nadu",
      "Kanpur": "Uttar Pradesh",
      "Kharagpur": "West Bengal",
      "Trichy": "Tamil Nadu",
      "Surathkal": "Karnataka",
      "Ranchi": "Jharkhand",
      "Patiala": "Punjab",
      "Bhubaneswar": "Odisha",
      "Gandhinagar": "Gujarat",
      "Hyderabad": "Telangana",
      "Indore": "Madhya Pradesh",
      "Guwahati": "Assam",
      "Patna": "Bihar",
      "Mandi": "Himachal Pradesh",
      "Palakkad": "Kerala",
      "Bhilai": "Chhattisgarh",
      "Goa": "Goa",
      "Jammu": "Jammu & Kashmir",
      "Vellore": "Tamil Nadu",
      "Pune": "Maharashtra",
      "Bangalore": "Karnataka",
      "Calicut": "Kerala",
      "Jaipur": "Rajasthan",
      "Rourkela": "Odisha",
    };
    return map[location] || location;
  };

  // Apply filters
  const filteredColleges = colleges.filter((c) => {
    const matchSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());

    const matchRating = c.rating ? c.rating >= minRating : true;

    const matchType = type === "All" || c.type?.toLowerCase() === type.toLowerCase();

    const matchState =
      stateFilter === "All States" ||
      getStateFromLocation(c.location)?.toLowerCase() === stateFilter.toLowerCase();

    const matchCourse =
      courseFilter === "All Courses" ||
      c.courses?.includes(courseFilter);

    return matchSearch && matchRating && matchType && matchState && matchCourse;
  });

  // Sorting
  const sortedColleges = [...filteredColleges].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setMinRating(0);
    setSortBy("rating");
    setType("All");
    setStateFilter("All States");
    setCourseFilter("All Courses"); // reset course
  };

  // Motion variants
  const panelVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  // Get unique courses dynamically
  const allCourses = Array.from(new Set(colleges.flatMap(c => c.courses))).sort();
  // 🔥 Toggle Compare
const toggleCompare = (college) => {
  setCompareList((prev) => {
    const exists = prev.find((c) => c.id === college.id);

    if (exists) {
      return prev.filter((c) => c.id !== college.id);
    }

    if (prev.length >= 3) {
      alert("You can compare only 3 colleges at a time");
      return prev;
    }

    return [...prev, college];
  });
};

// 🔥 Recommended College Logic
const maxRating = compareList.length
  ? Math.max(...compareList.map((c) => c.rating || 0))
  : 0;

const recommendedCollege = compareList.find(
  (c) => (c.rating || 0) === maxRating
);

  return (
    <div className="colleges-page">

      {/* Header */}
      <div className="college-header">
        <h1>
          {t("colleges.headerTitle", "Find Your Perfect")}{" "}
          <span>{t("colleges.headerSpan", "College")}</span>
        </h1>
        <p>
          {t(
            "colleges.headerDesc",
            "Discover top engineering colleges across India with detailed information and insights"
          )}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="search-filter-wrapper">
        <div className="search-row">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search colleges or cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="search-actions">
            <button
              className="filter-btn"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <Filter size={18} style={{ marginRight: "6px" }} />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="filters-panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="filter-grid">

                {/* State */}
                <div>
                  <label>State</label>
                  <div className="select-wrapper">
                    <select
                      value={stateFilter}
                      onChange={(e) => setStateFilter(e.target.value)}
                    >
                      <option>All States</option>
                      <option>Delhi</option>
                      <option>Maharashtra</option>
                      <option>Tamil Nadu</option>
                      <option>Uttar Pradesh</option>
                      <option>West Bengal</option>
                      <option>Karnataka</option>
                      <option>Jharkhand</option>
                      <option>Punjab</option>
                      <option>Odisha</option>
                      <option>Gujarat</option>
                      <option>Telangana</option>
                      <option>Madhya Pradesh</option>
                      <option>Assam</option>
                      <option>Bihar</option>
                      <option>Himachal Pradesh</option>
                      <option>Kerala</option>
                      <option>Chhattisgarh</option>
                      <option>Goa</option>
                      <option>Jammu & Kashmir</option>
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label>Type</label>
                  <div className="select-wrapper">
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                      <option value="All">All Types</option>
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>

                {/* Course */}
                <div>
                  <label>Course</label>
                  <div className="select-wrapper">
                    <select
                      value={courseFilter}
                      onChange={(e) => setCourseFilter(e.target.value)}
                    >
                      <option>All Courses</option>
                      {allCourses.map((course, idx) => (
                        <option key={idx}>{course}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>

                {/* Rating */}
                <div className="rating-filter">
                  <label>
                    Min Rating: <span>{minRating.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="rating-slider"
                  />
                </div>

                {/* Sort */}
                <div>
                  <label>Sort by</label>
                  <div className="select-wrapper">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="rating">All</option>
                      <option value="rating">Rating</option>
                      <option value="name">Name (A–Z)</option>
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>

              </div>

              {/* Filter Footer */}
              <div className="filter-footer">
                <span className="results-count">{sortedColleges.length} colleges found</span>
                <button className="clear-btn" onClick={clearFilters}>
                  <X size={16} style={{ marginRight: "6px" }} /> Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* College Grid */}
      <div className="college-grid">
        <AnimatePresence>
          {sortedColleges
            .slice(0, showAll ? sortedColleges.length : 8)
            .map((college) => (
              <motion.div
                key={college.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <CollegeCard
                college={college}
                toggleCompare={toggleCompare}
                compareList={compareList}
              />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

        {/* 🔥 Compare Bar */}
        {compareList.length > 0 && (
          <div className="compare-bar">
            <span>{compareList.length} Selected</span>

            <button
              disabled={compareList.length < 2}
              onClick={() => setShowCompare(true)}
            >
              Compare Now
            </button>
          </div>
        )}

      {/* More Button */}
      {!showAll && sortedColleges.length > 8 && (
        <motion.div
          className="more-btn-wrapper"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="more-colleges-btn" onClick={() => setShowAll(true)}>
            More Colleges
          </button>
        </motion.div>
      )}

      {/* 🔥 Compare Modal */}
      {showCompare && (
  <div className="compare-modal">
    <div className="compare-content">

      <div className="compare-header">
        <h2>College Comparison</h2>
        <button
          className="close-btn"
          onClick={() => {
            setShowCompare(false);
            setCompareList([]);
          }}
        >
          ✕
        </button>
      </div>

      {recommendedCollege && (
  <div className="recommended-banner">
    <div className="recommended-icon">🏆</div>
    Recommended College:
    <span>{recommendedCollege.name}</span>
  </div>
)}

      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              {compareList.map((c) => (
                <th key={c.id}>{c.name}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Rating Row */}
            <tr>
              <td>Rating</td>
              {compareList.map((c) => {
                const maxRating = Math.max(
                  ...compareList.map((col) => col.rating || 0)
                );

                return (
                  <td
                    key={c.id}
                    className={c.rating === maxRating ? "winner" : ""}
                  >
                    ⭐ {c.rating || "N/A"}
                    {c.rating === maxRating && (
                      <span className="badge">🏆 Best</span>
                    )}
                  </td>
                );
              })}
            </tr>

            <tr>
              <td>Location</td>
              {compareList.map((c) => (
                <td key={c.id}>{c.location}</td>
              ))}
            </tr>

            <tr>
              <td>Type</td>
              {compareList.map((c) => (
                <td key={c.id}>{c.type}</td>
              ))}
            </tr>

            <tr>
              <td>Fees</td>
              {compareList.map((c) => (
                <td key={c.id}>
                  {c.fees
                    ? `₹${Number(c.fees).toLocaleString()}`
                    : "N/A"}
                </td>
              ))}
            </tr>

            <tr>
              <td>Cutoff</td>
              {compareList.map((c) => (
                <td key={c.id}>{c.cutoff || "N/A"}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
)}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Colleges;
