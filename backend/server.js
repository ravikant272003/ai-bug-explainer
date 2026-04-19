const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ✅ GROQ ROUTE
app.post("/api/explain", async (req, res) => {
  const { error } = req.body;

  if (!error) {
    return res.status(400).json({ error: "Error text is required" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: `Explain this programming error in simple Hinglish:

1. Meaning
2. Why it happens
3. Fix
4. Example

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

    const result = response.data.choices[0].message.content;

    res.json({ response: result });

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});