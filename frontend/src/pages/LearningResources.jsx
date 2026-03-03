import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  BookOpen,
  Play,
  FileText,
  ExternalLink,
  Clock,
  Star,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/LearningResources.css";
import Footer from "../components/Footer";

/* ================= DATA ================= */
/* ✅ KEEPING YOUR SAME DATA — NOT REPEATING HERE FOR LENGTH */
/* ⛔ DO NOT MODIFY YOUR learningResources ARRAY */

const categories = [
  "All",
  "Programming",
  "Data Science",
  "Design",
  "Marketing",
  "Finance",
  "Management",
];

const types = ["All", "course", "video", "article", "book", "practice"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const typeIcons = {
  course: BookOpen,
  video: Play,
  article: FileText,
  book: BookOpen,
  practice: Star,
};

/* ================= PAGE ================= */

const LearningResources = () => {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [activeVideo, setActiveVideo] = useState(null);
  const [player, setPlayer] = useState(null);


  /* ================= DATA ================= */

const learningResources = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    type: "course",
    category: "Programming",
    difficulty: "Beginner",
    duration: "65 hours",
    rating: 4.7,
    description: "Learn full-stack web development from scratch.",
    link: "https://www.udemy.com/course/the-complete-web-development-bootcamp/?srsltid=AfmBOoooDMKyrV_--uSuGoCmxUt0osRUepaW5R-6XWVfOP_ABClVOB6r",
    author: "Angela Yu",
    topics: ["JavaScript", "React","PostgreSQL", "Node.js"],
    free: false,
  },
  {
    id: "2",
    title: "Python for Data Science (Learn Python, Pandas, NumPy, Matplotlib)",
    type: "video",
    category: "Data Science",
    difficulty: "Intermediate",
    duration: "12 hours",
    rating: 4.7,
    description: "Master data science using Python.",
    link: "https://youtu.be/LHBE6Q9XlzI?si=GikSOvyxjykO4yQJ",
    author: "freeCodeCamp.org",
    topics: ["Python", "Pandas", "NumPy","Matplotlib"],
    free: true,
  },
  {
    id: "3",
    title: "Machine Learning Crash Course",
    type: "course",
    category: "Data Science",
    difficulty: "Intermediate",
    duration: "40 hours",
    rating: 4.6,
    description: "Learn ML fundamentals with real examples.",
    link: "https://developers.google.com/machine-learning/crash-course",
    author: "Google AI",
    topics: ["ML", "TensorFlow", "Neural Networks"],
    free: true,
  },
  {
    id: "4",
    title: "React Practice Projects",
    type: "practice",
    category: "Programming",
    difficulty: "Intermediate",
    duration: "10 hours",
    rating: 4.4,
    description: "Hands-on React projects to improve skills.",
    link: "https://www.freecodecamp.org/news/master-react-by-building-25-projects/",
    author: "FreeCodeCamp",
    topics: ["React", "Hooks", "State"],
    free: true,
  },
  {
    id: "5",
    title: "UI/UX Design Principles",
    type: "book",
    category: "Design",
    difficulty: "Beginner",
    duration: "8 hours",
    rating: 4.9,
    description: "Learn the basics of user-centered design.",
    link: "https://course.ccs.neu.edu/cs5500sp17/09-UX.pdf",
    author: "Don Norman",
    topics: ["UX", "Design", "Usability"],
    free: false,
  },
  {
    id: "6",
    title: "Design Systems for Websites using Figma",
    type: "course",
    category: "Design",
    difficulty: "Beginners",
    duration: "5 Hours 5 Mins",
    rating: 4.4,
    description: "Create scalable design systems in Figma.",
    link: "https://www.awwwards.com/academy/course/design-systems-for-websites-using-figma",
    author: "Filip Felbar",
    topics: ["Figma", "UI", "Design System"],
    free: false,
  },
  {
    id: "7",
    title: "Digital Marketing Fundamentals",
    type: "course",
    category: "Marketing",
    difficulty: "Beginner",
    duration: "20 hours",
    rating: 4.5,
    description: "SEO, social media and online marketing basics.",
    link: "https://skillshop.exceedlms.com/student/collection/1830706-fundamentals-of-digital-marketing",
    author: "Google",
    topics: ["SEO", "Social Media", "Ads"],
    free: true,
  },
  {
    id: "8",
    title: "Content Marketing Guide",
    type: "article",
    category: "Marketing",
    difficulty: "Beginner",
    duration: "2 hours",
    rating: 4.3,
    description: "Learn content marketing strategies.",
    link: "https://cdn2.hubspot.net/hubfs/313892/Downloads/Influence%20&%20Co.The%20Ultimate%20Guide%20to%20Content%20Marketing.WHITEPAPER.FINAL.pdf",
    author: "HubSpot",
    topics: ["Content", "Branding"],
    free: true,
  },
  {
    id: "9",
    title: "FINANCIAL PLANNING FOR YOUNG INVESTORS",
    type: "book",
    category: "Finance",
    difficulty: "Beginner",
    duration: "4 hours",
    rating: 4.5,
    description: "Basics of budgeting and saving money.",
    link: "https://www.sebi.gov.in/sebi_data/investors/financial_literacy/College%20Students.pdf",
    author: "Securities and Exchange Board of India (SEBI)",
    topics: ["Budgeting", "Savings"],
    free: true,
  },
  {
    id: "10",
    title: "Business and Financial Modeling Specialization",
    type: "course",
    category: "Finance",
    difficulty: "Beginner",
    duration: "52 hours",
    rating: 4.5,
    description: "Advanced financial modeling techniques.",
    link: "https://www.coursera.org/specializations/wharton-business-financial-modeling",
    author: "Wharton",
    topics: ["Excel", "Valuation"],
    free: false,
  },
  {
    id: "11",
    title: "Agile Project Management",
    type: "article",
    category: "Management",
    difficulty: "Intermediate",
    duration: "2 hours",
    rating: 4.4,
    description: "Guide to agile and scrum frameworks.",
    link: "https://www.pmi.org/learning/agile",
    author: "PMI",
    topics: ["Agile", "Scrum"],
    free: true,
  },
  {
    id: "12",
    title: "Leadership Skills",
    type: "course",
    category: "Management",
    difficulty: "Beginner",
    duration: "46 hours",
    rating: 4.8,
    description: "Improve leadership and communication skills.",
    link: "https://www.coursera.org/learn/leadershipskills",
    author: "Coursera",
    topics: ["Leadership", "Team"],
    free: true,
  },
  {
    id: "13",
    title: "JavaScript Pro: Mastering Advanced Concepts and Techniques",
    type: "course",
    category: "Programming",
    difficulty: "Advanced",
    duration: "19 hours",
    rating: 4.7,
    description: "Deep dive into advanced JavaScript.",
    link: "https://www.udemy.com/course/pro-javascript/",
    author: "Colt Steele",
    topics: ["Closures", "Async", "Performance"],
    free: false,
  },
  {
    id: "14",
    title: "SQL for Beginners",
    type: "video",
    category: "Programming",
    difficulty: "Beginner",
    duration: "3 hours",
    rating: 4.4,
    description: "Learn SQL queries and databases.",
    link: "https://youtu.be/yE6tIle64tU?si=Jx2ge8ddU6FyMaqO",
    author: "CodeWithHarry",
    topics: ["SQL", "Database"],
    free: true,
  },
  {
    id: "15",
    title: "SQL for Beginners",
    type: "video",
    category: "Programming",
    difficulty: "Beginner",
    duration: "3 hours",
    rating: 4.4,
    description: "Learn SQL queries and databases.",
    link: "https://youtu.be/yE6tIle64tU?si=Jx2ge8ddU6FyMaqO",
    author: "CodeWithHarry",
    topics: ["SQL", "Database"],
    free: true,
  },
];

  /* ================= FILTER LOGIC ================= */

  const filtered = learningResources.filter((r) => {
    const text = r.title + r.description + r.topics.join(" ");
    return (
      (category === "All" || r.category === category) &&
      (type === "All" || r.type === type) &&
      (difficulty === "All" || r.difficulty === difficulty) &&
      text.toLowerCase().includes(search.toLowerCase())
    );
  });

  /* ================= YOUTUBE PROGRESS ================= */

  useEffect(() => {
    if (!activeVideo) return;

    const createPlayer = () => {
      const savedTime =
        Number(localStorage.getItem(`progress-${activeVideo}`)) || 0;

      const ytPlayer = new window.YT.Player("yt-player", {
        videoId: activeVideo,
        playerVars: { start: savedTime },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              const interval = setInterval(() => {
                const time = ytPlayer.getCurrentTime();
                localStorage.setItem(
                  `progress-${activeVideo}`,
                  Math.floor(time)
                );
              }, 3000);
              ytPlayer.interval = interval;
            }

            if (event.data === window.YT.PlayerState.PAUSED) {
              clearInterval(ytPlayer.interval);
            }
          },
        },
      });

      setPlayer(ytPlayer);
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (player) player.destroy();
    };
  }, [activeVideo]);

  /* ================= CLICK HANDLER ================= */

  const handleAccess = (resource) => {
    if (resource.link.includes("youtu")) {
      const id = resource.link.split("youtu.be/")[1]?.split("?")[0];
      setActiveVideo(id);
    } else {
      window.open(resource.link, "_blank");
    }
  };

  /* ================= CARD ================= */
const ResourceCard = ({ resource }) => {
  const Icon = typeIcons[resource.type];

  return (
    <motion.div
      className="resource-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-header">
        <div className="icon-box">
          <Icon size={20} />
        </div>

        <div>
          <h3>{t(resource.title)}</h3>
          <p className="author">
            {t("by")} {resource.author}
          </p>
        </div>

        <span className={`badge ${resource.free ? "free" : "paid"}`}>
          {resource.free ? t("Free") : t("Paid")}
        </span>
      </div>

      <p className="description">{t(resource.description)}</p>

      <div className="topics">
        {resource.topics.map((tpc, i) => (
          <span key={i}>{t(tpc)}</span>
        ))}
      </div>

      <div className="meta">
        <div>
          <Clock size={14} /> {resource.duration}
        </div>
        <div>
          <Star size={14} /> {resource.rating}
        </div>
        <span className={`difficulty ${resource.difficulty.toLowerCase()}`}>
          {t(resource.difficulty)}
        </span>
      </div>

      {/* Access button only triggers link */}
      <button
        className="access-btn"
        onClick={(e) => {
          e.stopPropagation(); // prevents bubbling
          handleAccess(resource);
        }}
      >
        {t("Access")} <ExternalLink size={16} />
      </button>
    </motion.div>
  );
};


  /* ================= RENDER ================= */

  return (
    <div className="resources-page">
      <div className="top-bar">
        <Link to="/" className="back-btn">
          <ArrowLeft size={18} /> {t("Back")}
        </Link>

        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} /> {t("Filters")}
        </button>
      </div>

      <motion.h1
        className="page-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("Learning Resources")}
      </motion.h1>

      <p className="subtitle">
        {t("Curated courses, videos & practice material")}
      </p>

      <div className="search-box">
        <Search size={18} />
        <input
          placeholder={t("Search resources, topics...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* CATEGORY */}
            <div>
              <label>{t("Category")}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c}>{t(c)}</option>
                ))}
              </select>
            </div>

            {/* TYPE */}
            <div>
              <label>{t("Type")}</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {types.map((tp) => (
                  <option key={tp}>{t(tp)}</option>
                ))}
              </select>
            </div>

            {/* DIFFICULTY */}
            <div>
              <label>{t("Difficulty")}</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                {difficulties.map((d) => (
                  <option key={d}>{t(d)}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="resources-grid">
        {filtered.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="no-results">
          <Search size={40} />
          <p>{t("No resources found")}</p>
        </div>
      )}

      <div className="cta">
        <h2>{t("Ready to Start Learning?")}</h2>
        <div className="cta-actions">
          <Link to="/quiz">{t("Take Career Quiz")}</Link>
          <Link to="/roadmap" className="outline">
            {t("Create Learning Path")}
          </Link>
        </div>
      </div>

      {/* ================= VIDEO MODAL ================= */}

      {/* ================= VIDEO MODAL ================= */}

{activeVideo && (
  <div className="video-modal" onClick={() => setActiveVideo(null)}>
    <motion.div
      className="video-container"
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {(() => {
        const resource = learningResources.find(
          (r) => r.link.includes(activeVideo)
        );
        if (!resource) return null;
        const Icon = typeIcons[resource.type];
        return (
          <>
            {/* HEADER */}
            <div className="modal-header">
              <h2>{resource.title}</h2>
              <button className="close-btn" onClick={() => setActiveVideo(null)}>×</button>
            </div>

            {/* META */}
            <div className="modal-meta">
              <p><strong>{resource.author}</strong> | <span className={`badge ${resource.free ? "free" : "paid"}`}>{resource.free ? "Free" : "Paid"}</span></p>
              <p>{resource.duration} | ⭐ {resource.rating} | {resource.difficulty}</p>
            </div>

            {/* VIDEO */}
            <div className="video-wrapper">
              <div id="yt-player"></div>
            </div>

            {/* DESCRIPTION + TOPICS */}
            <div className="modal-description">
              <p>{resource.description}</p>
              <div className="topics">
                {resource.topics.map((tpc, i) => (
                  <span key={i}>{tpc}</span>
                ))}
              </div>
            </div>

            {/* BUTTON */}
            <button
              className="access-btn"
              onClick={() => window.open(resource.link, "_blank")}
            >
              Open on YouTube <ExternalLink size={16} />
            </button>
          </>
        );
      })()}
    </motion.div>
  </div>
)}


      <Footer />
    </div>
    
  );
};

export default LearningResources;