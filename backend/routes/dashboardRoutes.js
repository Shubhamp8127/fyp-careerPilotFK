import express from "express";
import {
  getDashboard,
  logDashboardActivity,
  incrementLearningResourcesAccessed,
  incrementFeatureUsage,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDashboard);
router.post("/activity", protect, logDashboardActivity);
router.post("/increment-learning-resources", protect, incrementLearningResourcesAccessed);
router.post("/feature-used", protect, incrementFeatureUsage);

export default router;
