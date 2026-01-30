import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { streamRoutes } from "./routes/stream";
import { githubRoutes } from "./routes/github";
import { chatbotRoutes } from "./routes/chatbot";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      !process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "https://collabclass.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/stream", streamRoutes);
app.use("/api/github", githubRoutes);
app.use("/api", chatbotRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
