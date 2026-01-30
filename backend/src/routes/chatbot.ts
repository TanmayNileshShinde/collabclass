import { Request, Response } from "express";
import dotenv from "dotenv";
import express from "express";
import Groq from "groq-sdk";

dotenv.config();
if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing in environment variables");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const router = express.Router();

// Chat endpoint
router.post("/chatbot", async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Build conversation context for Groq
    let contextMessages = [];

    // Add conversation history (last 5 messages)
    if (conversationHistory && conversationHistory.length > 0) {
      contextMessages = conversationHistory.slice(-5).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));
    }
    contextMessages.push({
      role: "user",
      content: message,
    });

    const systemPrompt = `You are a helpful AI assistant for video meetings. You help users with:
    - Meeting management and scheduling
    - Technical troubleshooting
    - Meeting etiquette and best practices
    - Note-taking and action items
    - General meeting assistance

    Be concise, friendly, and helpful. Keep responses under 150 words when possible.`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...contextMessages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response =
      completion.choices[0]?.message?.content ||
      "I'm here to help with your meeting! What would you like to know?";

    res.json({ response });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      error: "Failed to process message",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export { router as chatbotRoutes };
