import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const {
      careerGoal,
      level,
      interests,
      learningStyle,
      hoursPerWeek,
      timeline,
    } = req.body;

    if (!careerGoal) {
      return res.status(400).json({ error: "careerGoal is required" });
    }

    const prompt = `You are an expert career coach. Generate a detailed, structured career roadmap in MARKDOWN format for the following user details. Include sections: Overview, Learning phases (with timelines), Skills to learn, Recommended tools, Suggested projects, Learning resources, and Tips for becoming job-ready. Use concise bullet lists where appropriate and include suggested durations for each phase.

Career Goal: ${careerGoal}
Current Level: ${level || "Not specified"}
Areas of Interest: ${Array.isArray(interests) ? interests.join(", ") : interests || "None"}
Learning Style: ${learningStyle || "Mixed"}
Hours Per Week: ${hoursPerWeek || "Not specified"}
Target Timeline (months): ${timeline || "Not specified"}

Produce the roadmap in clear markdown with headings and subheadings.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.json({ roadmap: text });
  } catch (error) {
    console.error("Generate roadmap error:", error);
    return res.status(500).json({ error: "Failed to generate roadmap" });
  }
});

export default router;
