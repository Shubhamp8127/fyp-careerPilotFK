import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

/* ===============================
   🔥 MONGOOSE MODEL (ADDED)
================================ */
const savedCollegeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  collegeId: {
    type: Number,
    required: true
  },
  collegeName: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SavedCollege = mongoose.model("SavedCollege", savedCollegeSchema);

/* ===============================
   ✅ 50 colleges ka data (UNCHANGED)
================================ */
const colleges = 
[
{ id: 1, name: "IIT Delhi", location: "New Delhi", lat: 28.5457, lng: 77.1928, type: "Government", rating: 4.8, est: 1961, fees: 250000, cutoff: "95%", courses: ["B.Tech", "M.Tech", "PhD"] },
  { id: 2, name: "IIT Bombay", location: "Mumbai", lat: 19.1334, lng: 72.9133, type: "Government", rating: 4.9, est: 1958, fees: 260000, cutoff: "96%", courses: ["B.Tech", "M.Tech", "MBA"] },
  { id: 3, name: "IIT Madras", location: "Chennai", lat: 12.9915, lng:80.2337, type: "Government", rating: 4.8, est: 1959, fees: 250000, cutoff: "95%", courses: ["B.Tech", "M.Tech", "PhD"] },
  { id: 4, name: "IIT Kanpur", location: "Kanpur", lat: 26.5123, lng: 80.2333, type: "Government", rating: 4.7, est: 1959, fees: 240000, cutoff: "94%", courses: ["B.Tech", "M.Tech", "PhD"] },
  { id: 5, name: "IIT Kharagpur", location: "Kharagpur", lat:22.3144, lng: 87.3096, type: "Government", rating: 4.6, est: 1951, fees: 230000, cutoff: "93%", courses: ["B.Tech", "M.Tech", "MBA"] },
  { id: 6, name: "NIT Trichy", location: "Trichy", lat: 10.7589, lng: 78.8132, type: "Government", rating: 4.7, est: 1964, fees: 220000, cutoff: "92%", courses: ["B.Tech", "M.Tech"] },
  { id: 7, name: "NIT Surathkal", location: "Surathkal", lat: 13.0108, lng: 74.7943, type: "Government", rating: 4.6, est: 1960, fees: 210000, cutoff: "91%", courses: ["B.Tech", "M.Tech"] },
  { id: 8, name: "BIT Mesra", location: "Ranchi", lat: 23.4123, lng: 85.4399, type: "Private", rating: 4.5, est: 1955, fees: 180000, cutoff: "90%", courses: ["B.Tech", "M.Tech", "MBA"] },
  { id: 9, name: "VIT Vellore", location: "Vellore", lat: 12.9692, lng:79.1559, type: "Private", rating: 4.4, est: 1984, fees: 200000, cutoff: "89%", courses: ["B.Tech", "M.Tech", "MBA"] },
  { id: 10, name: "SRM Institute", location: "Chennai", lat: 12.8229, lng: 80.0440, type: "Private", rating: 4.3, est: 1985, fees: 190000, cutoff: "88%", courses: ["B.Tech", "M.Tech"] },

  { id: 11, name: "Anna University", location: "Chennai", lat: 13.0111, lng: 80.2363, type: "Government", rating: 4.2, est: 1978, fees: 120000, cutoff: "85%", courses: ["B.E", "M.E", "MBA"] },
  { id: 12, name: "Manipal Institute", location: "Manipal", lat: 13.3533, lng: 74.7849, type: "Private", rating: 4.3, est: 1953, fees: 180000, cutoff: "87%", courses: ["B.Tech", "M.Tech", "MBA"] },
  { id: 13, name: "Jamia Millia Islamia", location: "New Delhi", lat:28.5605, lng: 77.2836, type: "Government", rating: 4.1, est: 1920, fees: 90000, cutoff: "80%", courses: ["B.Tech", "MBA"] },
  { id: 14, name: "Jadavpur University", location: "Kolkata", lat: 22.4999, lng: 88.3710, type: "Government", rating: 4.0, est: 1955, fees: 100000, cutoff: "82%", courses: ["B.Tech", "M.Tech"] },
  { id: 15, name: "Delhi University", location: "New Delhi", lat: 28.5844, lng: 77.1629, type: "Government", rating: 4.0, est: 1922, fees: 80000, cutoff: "78%", courses: ["B.A", "B.Sc", "B.Com"] },

  { id: 16, name: "BMS College", location: "Bangalore", lat: 12.9416, lng: 77.5668, type: "Private", rating: 3.9, est: 1946, fees: 150000, cutoff: "85%", courses: ["B.Tech", "MBA"] },
  { id: 17, name: "MIT Pune", location: "Pune", lat: 18.5178, lng: 73.8151, type: "Private", rating: 4.1, est: 1983, fees: 160000, cutoff: "86%", courses: ["B.Tech", "MBA", "M.Tech"] },
  { id: 18, name: "COEP Pune", location: "Pune", lat: 18.5304, lng: 73.8564, type: "Government", rating: 4.2, est: 1854, fees: 140000, cutoff: "87%", courses: ["B.Tech", "M.Tech"] },
  { id: 19, name: "Manipal College of Engineering", location: "Manipal", lat: 13.347, lng: 74.783, type: "Private", rating: 4.0, est: 1953, fees: 180000, cutoff: "85%", courses: ["B.Tech", "M.Tech"] },
  { id: 20, name: "Thapar Institute", location: "Patiala", lat: 30.3522, lng: 76.3737, type: "Private", rating: 4.1, est: 1956, fees: 170000, cutoff: "84%", courses: ["B.Tech", "M.Tech"] },

  { id: 21, name: "IIT Bhubaneswar", location: "Bhubaneswar", lat: 20.1483, lng: 85.6712, type: "Government", rating: 4.4, est: 2008, fees: 220000, cutoff: "91%", courses: ["B.Tech", "M.Tech"] },
  { id: 22, name: "IIT Gandhinagar", location: "Gandhinagar", lat: 23.2133, lng:  72.6857, type: "Government", rating: 4.3, est: 2008, fees: 210000, cutoff: "90%", courses: ["B.Tech", "M.Tech"] },
  { id: 23, name: "IIT Hyderabad", location: "Hyderabad", lat: 17.5947, lng: 78.1230, type: "Government", rating: 4.5, est: 2008, fees: 220000, cutoff: "92%", courses: ["B.Tech", "M.Tech"] },
  { id: 24, name: "IIT Indore", location: "Indore", lat:  22.52, lng:  75.92, type: "Government", rating: 4.4, est: 2009, fees: 210000, cutoff: "91%", courses: ["B.Tech", "M.Tech"] },
  { id: 25, name: "IIT Ropar", location: "Ropar", lat: 30.9713, lng:76.4732, type: "Government", rating: 4.3, est: 2008, fees: 210000, cutoff: "90%", courses: ["B.Tech", "M.Tech"] },

  { id: 26, name: "IIT Guwahati", location: "Guwahati", lat:26.1923, lng: 91.6951, type: "Government", rating: 4.6, est: 1994, fees: 230000, cutoff: "93%", courses: ["B.Tech", "M.Tech", "PhD"] },
  { id: 27, name: "IIT Patna", location: "Patna", lat:25.54, lng:84.85, type: "Government", rating: 4.2, est: 2008, fees: 210000, cutoff: "90%", courses: ["B.Tech", "M.Tech"] },
  { id: 28, name: "IIT Mandi", location: "Mandi", lat: 31.7754, lng: 76.9861, type: "Government", rating: 4.3, est: 2009, fees: 210000, cutoff: "91%", courses: ["B.Tech", "M.Tech"] },
  { id: 29, name: "IIT Palakkad", location: "Palakkad", lat: 10.8048, lng:76.7289, type: "Government", rating: 4.2, est: 2015, fees: 200000, cutoff: "89%", courses: ["B.Tech", "M.Tech"] },
  { id: 30, name: "IIT Bhilai", location: "Bhilai", lat: 21.2471, lng:21.2471, type: "Government", rating: 4.1, est: 2008, fees: 200000, cutoff: "88%", courses: ["B.Tech", "M.Tech"] },

  { id: 31, name: "IIT Goa", location: "Goa", lat: 15.4226, lng:73.9798, type: "Government", rating: 4.0, est: 2016, fees: 190000, cutoff: "87%", courses: ["B.Tech", "M.Tech"] },
  { id: 32, name: "IIT Jammu", location: "Jammu", lat: 32.7266, lng: 74.8570, type: "Government", rating: 4.1, est: 2016, fees: 190000, cutoff: "87%", courses: ["B.Tech", "M.Tech"] },
  { id: 33, name: "IIT Dharwad", location: "Dharwad", lat: 15.4589, lng: 75.0078, type: "Government", rating: 4.0, est: 2016, fees: 190000, cutoff: "86%", courses: ["B.Tech", "M.Tech"] },
  { id: 34, name: "NIT Warangal", location: "Warangal", lat: 17.9689, lng: 79.5941, type: "Government", rating: 4.5, est: 1959, fees: 210000, cutoff: "92%", courses: ["B.Tech", "M.Tech"] },
  { id: 35, name: "NIT Jaipur", location: "Jaipur", lat: 26.9124, lng: 75.7873, type: "Government", rating: 4.4, est: 1963, fees: 210000, cutoff: "91%", courses: ["B.Tech", "M.Tech"] },

  { id: 36, name: "NIT Rourkela", location: "Rourkela", lat: 22.2604, lng: 84.8536, type: "Government", rating: 4.3, est: 1961, fees: 210000, cutoff: "90%", courses: ["B.Tech", "M.Tech"] },
  { id: 37, name: "NIT Calicut", location: "Calicut", lat: 11.2588, lng: 75.7804, type: "Government", rating: 4.2, est: 1961, fees: 210000, cutoff: "89%", courses: ["B.Tech", "M.Tech"] },
  { id: 38, name: "BMSCE", location: "Bangalore", lat: 12.9716, lng: 77.5946, type: "Private", rating: 4.1, est: 1946, fees: 150000, cutoff: "85%", courses: ["B.Tech", "MBA"] },
  { id: 39, name: "MIT Pune", location: "Pune", lat: 18.5204, lng: 73.8567, type: "Private", rating: 4.1, est: 1983, fees: 160000, cutoff: "86%", courses: ["B.Tech", "MBA", "M.Tech"] },
  { id: 40, name: "Manipal College of Engineering", location: "Manipal", lat: 13.3520, lng: 74.7923, type: "Private", rating: 4.0, est: 1953, fees: 180000, cutoff: "85%", courses: ["B.Tech", "M.Tech"] },

  { id: 41, name: "Thapar Institute", location: "Patiala", lat: 30.3398, lng: 76.3869, type: "Private", rating: 4.1, est: 1956, fees: 170000, cutoff: "84%", courses: ["B.Tech", "M.Tech"] },
  { id: 42, name: "SRM Institute", location: "Chennai", lat: 13.0827, lng: 80.2707, type: "Private", rating: 4.3, est: 1985, fees: 190000, cutoff: "88%", courses: ["B.Tech", "M.Tech"] },
  { id: 43, name: "VIT Vellore", location: "Vellore", lat: 12.9165, lng: 79.1325, type: "Private", rating: 4.4, est: 1984, fees: 200000, cutoff: "89%", courses: ["B.Tech", "M.Tech", "MBA"] },
  { id: 44, name: "Jamia Millia Islamia", location: "New Delhi", lat: 28.6139, lng: 77.2090, type: "Government", rating: 4.1, est: 1920, fees: 90000, cutoff: "80%", courses: ["B.Tech", "MBA"] },
  { id: 45, name: "Jadavpur University", location: "Kolkata", lat: 22.5726, lng: 88.3639, type: "Government", rating: 4.0, est: 1955, fees: 100000, cutoff: "82%", courses: ["B.Tech", "M.Tech"] },

  { id: 46, name: "Delhi University", location: "New Delhi", lat: 28.6139, lng: 77.2090, type: "Government", rating: 4.0, est: 1922, fees: 80000, cutoff: "78%", courses: ["B.A", "B.Sc", "B.Com"] },
  { id: 47, name: "Anna University", location: "Chennai", lat: 13.0827, lng: 80.2707, type: "Government", rating: 4.2, est: 1978, fees: 120000, cutoff: "85%", courses: ["B.E", "M.E", "MBA"] },
  { id: 48, name: "COEP Pune", location: "Pune", lat: 18.5204, lng: 73.8567, type: "Government", rating: 4.2, est: 1854, fees: 140000, cutoff: "87%", courses: ["B.Tech", "M.Tech"] },
  { id: 49, name: "BMS College of Engineering", location: "Bangalore", lat: 12.9716, lng: 77.5946, type: "Private", rating: 3.9, est: 1946, fees: 150000, cutoff: "85%", courses: ["B.Tech", "MBA"] },
  { id: 50, name: "IIT Patiala", location: "Patiala", lat: 30.3398, lng: 76.3869, type: "Government", rating: 4.1, est: 1965, fees: 200000, cutoff: "87%", courses: ["B.Tech", "M.Tech"] }

];

/* ===============================
   ✅ GET all colleges (UNCHANGED)
================================ */
router.get("/", (req, res) => {
  res.status(200).json(colleges);
});

/* ===============================
   🔖 SAVE / UNSAVE COLLEGE (UPDATED)
================================ */
router.post("/bookmark", protect, async (req, res) => {
  try {
    const { collegeId } = req.body;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const numericCollegeId = Number(collegeId);
    if (!collegeId || Number.isNaN(numericCollegeId)) {
      return res.status(400).json({ message: "College id is required" });
    }

    const college = colleges.find(c => c.id === numericCollegeId);
    if (!college) return res.status(404).json({ message: "College not found" });

    const existing = await SavedCollege.findOne({ userId, collegeId: numericCollegeId });

    if (existing) {
      await SavedCollege.deleteOne({ _id: existing._id });
      return res.json({ saved: false });
    }

    await SavedCollege.create({
      userId,
      collegeId: numericCollegeId,
      collegeName: college.name
    });

    res.json({ saved: true });
  } catch (err) {
    console.error("Error in bookmark route:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===============================
   � GET saved colleges for current user
================================ */
router.get("/bookmark", protect, async (req, res) => {
  try {
    const userId = req.user?._id?.toString();

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const savedDocs = await SavedCollege.find({ userId });
    const savedCollegeIds = savedDocs.map((c) => c.collegeId);
    const savedColleges = colleges
      .filter((college) => savedCollegeIds.includes(college.id))
      .map((college) => {
        const meta = savedDocs.find((item) => item.collegeId === college.id);
        return {
          ...college,
          savedAt: meta?.createdAt,
          saved: true,
        };
      });

    res.json({ count: savedColleges.length, savedColleges });
  } catch (err) {
    console.error("Error fetching saved colleges:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===============================
   🔥 UNSAVE A COLLEGE
================================ */
router.delete("/bookmark/:collegeId", protect, async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    const collegeId = Number(req.params.collegeId);

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!collegeId || Number.isNaN(collegeId)) {
      return res.status(400).json({ message: "Invalid college id" });
    }

    const saved = await SavedCollege.findOne({ userId, collegeId });
    if (!saved) {
      return res.status(404).json({ message: "Saved college not found" });
    }

    await SavedCollege.deleteOne({ _id: saved._id });
    res.json({ success: true, removedId: collegeId });
  } catch (err) {
    console.error("Error removing saved college:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===============================
   📊 DASHBOARD COUNT (UPDATED)
================================ */
router.get("/bookmark/count", protect, async (req, res) => {
  try {
    const userId = req.user?._id?.toString();

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const savedColleges = await SavedCollege.find({ userId });
    const count = savedColleges.length;

    res.json({ count, savedColleges: savedColleges.map((c) => c.collegeId) });
  } catch (err) {
    console.error("Error in count route:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===============================
   ✅ GET single college by id (MUST BE LAST)
================================ */
router.get("/:id", (req, res) => {
  const college = colleges.find(c => c.id === Number(req.params.id));

  console.log("Sending college:", college);

  if (!college) return res.status(404).json({ message: "College not found" });

  res.json(college);
});

export default router;
