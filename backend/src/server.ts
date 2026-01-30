import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { streamRoutes } from "./routes/stream";
import { githubRoutes } from "./routes/github";
import { chatbotRoutes } from "./routes/chatbot";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Optimized CORS for local development and production
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "https://collabclass.vercel.app",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/stream", streamRoutes);
app.use("/api/github", githubRoutes);
app.use("/api", chatbotRoutes);

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Only listen when running locally
// Vercel handles the "listening" part via Serverless Functions
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// CRITICAL: Export for Vercel
export default app;
