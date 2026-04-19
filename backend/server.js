const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend (for local / Render fullstack)
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Health check route
app.get("/test", (req, res) => {
  res.json({
    message: "server working",
    key: process.env.GROQ_API_KEY ? "present" : "missing"
  });
});

// 🔥 AI ROUTE
app.post("/api/explain", async (req, res) => {
  const { error } = req.body;

  console.log("🔥 Incoming:", error);

  if (!error) {
    return res.status(400).json({ error: "Error text is required" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `Explain this programming error in very simple Hinglish for a beginner.

Give:
1. Meaning (short)
2. Why it happens
3. Fix (step-by-step)
4. Example code

Error:
${error}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result =
      response.data?.choices?.[0]?.message?.content ||
      "No response from AI";

    console.log("✅ AI RESPONSE:", result);

    res.json({ response: result });

  } catch (err) {
    console.error("❌ FULL ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: "Failed to fetch AI response"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});