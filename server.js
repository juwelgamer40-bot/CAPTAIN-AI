
const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.get("/api/health", (req, res) => {
  res.json({ status: "CAPTAIN AI is online" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Please enter a message"
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction:
          "You are CAPTAIN AI, a helpful multilingual assistant. Reply in Bengali, Hindi or English according to the user's language."
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("CAPTAIN AI Error:", error);
    res.status(500).json({
      error: "CAPTAIN AI is temporarily unavailable. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CAPTAIN AI running on port ${PORT}`);
});
