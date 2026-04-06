import WeeklyProgress from "../models/WeeklyProgress.js";
import Activity from "../models/Activity.js";
import User from "../models/User.js";

const getWeekStart = (date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
};

const getDayLabel = (date) => {
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const createEmptyWeeklyData = (weekStart) => {
  return Array.from({ length: 7 }, (_, index) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(dayDate.getDate() + index);
    return {
      day: getDayLabel(dayDate),
      value: 0,
    };
  });
};

const mergeWeeklyData = (existingData, weekStart) => {
  const result = createEmptyWeeklyData(weekStart);
  if (!Array.isArray(existingData)) return result;

  existingData.forEach((entry) => {
    const index = result.findIndex((item) => item.day === entry.day);
    if (index !== -1) {
      result[index].value = entry.value || 0;
    }
  });

  return result;
};

export const getDashboard = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized. User not found." });
    }

    const currentWeekStart = getWeekStart(new Date());
    const weeklyProgressDoc = await WeeklyProgress.findOne({
      user: user._id,
      weekStart: currentWeekStart,
    });

    const recentActivity = await Activity.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const activitiesCount = await Activity.countDocuments({ user: user._id });

    res.json({
      username: `${user.first_name || ""} ${user.last_name || ""}`.trim(),

      quizzes: user.quizzes?.length || 0,

      // ✅ FIXED: BOOKMARK COUNT
      colleges: user.savedCollegesCount || 0,

      learningResourcesAccessed: user.learningResourcesAccessed || 0,
      achievements: user.achievements?.length || 0,
      activitiesLogged: activitiesCount,

      weeklyProgress: mergeWeeklyData(weeklyProgressDoc?.data, currentWeekStart),
      recentActivity,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logDashboardActivity = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { message, type } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: "Activity message required" });
    }

    const newActivity = new Activity({
      user: user._id,
      message,
      type: type || "info",
    });

    await newActivity.save();

    res.status(201).json({ success: true, activity: newActivity });
  } catch (err) {
    console.error("Log activity error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const incrementLearningResourcesAccessed = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await User.findByIdAndUpdate(user._id, {
      $inc: { learningResourcesAccessed: 1 },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Increment learning resources error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const incrementFeatureUsage = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const currentWeekStart = getWeekStart(new Date());
    const todayLabel = getDayLabel(new Date());

    let weeklyProgressDoc = await WeeklyProgress.findOne({
      user: user._id,
      weekStart: currentWeekStart,
    });

    if (!weeklyProgressDoc) {
      weeklyProgressDoc = await WeeklyProgress.create({
        user: user._id,
        weekStart: currentWeekStart,
        data: createEmptyWeeklyData(currentWeekStart),
      });
    }

    const entry = weeklyProgressDoc.data.find((item) => item.day === todayLabel);
    if (entry) {
      entry.value += 1;
    } else {
      weeklyProgressDoc.data.push({ day: todayLabel, value: 1 });
    }

    await weeklyProgressDoc.save();

    res.status(200).json({ success: true, weeklyProgress: weeklyProgressDoc.data });
  } catch (err) {
    console.error("Increment feature usage error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
