const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve frontend (optional for local)
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 🔥 AI ROUTE
app.post("/api/explain", async (req, res) => {
  const { error } = req.body;

  // Validation
  if (!error) {
    return res.status(400).json({ error: "Error text is required" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/auto", // ✅ FREE model auto select
        messages: [
          {
            role: "user",
            content: `Explain this programming error in very simple Hinglish for a beginner.

Give:
1. Meaning (short)
2. Why it happens
3. Fix (step-by-step)
4. Wrong code example
5. Correct code example

Error:
${error}`
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-frontend-url.vercel.app", // optional
          "X-Title": "AI Bug Explainer"
        }
      }
    );

    const result =
      response.data?.choices?.[0]?.message?.content ||
      "No response from AI";

    res.json({ response: result });

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: "Failed to fetch AI response"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});