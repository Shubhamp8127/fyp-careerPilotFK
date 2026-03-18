import express from "express";
import { getDashboard, logDashboardActivity } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDashboard);
router.post("/activity", protect, logDashboardActivity);

export default router;
