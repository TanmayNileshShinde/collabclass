import { Router } from "express";
import { verifyToken } from "@clerk/clerk-sdk-node";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Get GitHub token from environment (optional but recommended for higher rate limits)
const getGitHubToken = () => {
  return (
    process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN || ""
  );
};

// Log token status on startup (without exposing the actual token)
const GITHUB_TOKEN = getGitHubToken();
if (GITHUB_TOKEN) {
  console.log(
    "✅ GitHub token is configured. Authenticated requests will be used.",
  );
} else {
  console.warn(
    "⚠️  GitHub token not found. Using unauthenticated requests (60 req/hour limit). Set GITHUB_TOKEN in environment variables.",
  );
}

// middleware to verify clerk auth
const verifyAuth = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7);
    if (!token) {
      return res.status(401).json({ error: "Token is missing" });
    }
    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: "Invalid token: missing user ID" });
    }

    req.userId = decoded.sub;
    next();
  } catch (error) {
    console.error("Auth verification error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Authentication failed";
    return res
      .status(401)
      .json({ error: `Authentication failed: ${errorMessage}` });
  }
};

// Get repository contents (this must come first)
router.get(
  "/repo/:owner/:repo/contents/*",
  verifyAuth,
  async (req: any, res) => {
    try {
      const { owner, repo } = req.params;
      const path = req.params[0] || ""; // Get the rest of the path
      const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

      // Build headers with optional GitHub token for authenticated requests
      const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "CollabClass-App",
      };

      const githubToken = getGitHubToken();
      if (githubToken) {
        headers["Authorization"] = `Bearer ${githubToken}`;
      } else {
        console.warn(
          `GitHub API request without authentication: ${githubApiUrl}`,
        );
      }

      const response = await axios.get(githubApiUrl, { headers });

      res.json(response.data);
    } catch (error: any) {
      console.error("Error fetching repository contents:", error);
      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch repository contents";
      res.status(statusCode).json({
        error: errorMessage,
        details: error.response?.data || error.message,
      });
    }
  },
);

// Get repository root contents
router.get("/repo/:owner/:repo/contents", verifyAuth, async (req: any, res) => {
  try {
    const { owner, repo } = req.params;
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;

    // Build headers with optional GitHub token for authenticated requests
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "CollabClass-App",
    };

    const githubToken = getGitHubToken();
    if (githubToken) {
      headers["Authorization"] = `Bearer ${githubToken}`;
    } else {
      console.warn(
        `GitHub API request without authentication: ${githubApiUrl}`,
      );
    }

    const response = await axios.get(githubApiUrl, { headers });

    res.json(response.data);
  } catch (error: any) {
    console.error("Error fetching repository root contents:", error);
    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch repository root contents";
    res.status(statusCode).json({
      error: errorMessage,
      details: error.response?.data || error.message,
    });
  }
});

// Get repository information (this must come after the contents route)
router.get("/repo/:owner/:repo", verifyAuth, async (req: any, res) => {
  try {
    const { owner, repo } = req.params;
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    // Build headers with optional GitHub token for authenticated requests
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "CollabClass-App",
    };

    const githubToken = getGitHubToken();
    if (githubToken) {
      headers["Authorization"] = `Bearer ${githubToken}`;
    } else {
      console.warn(
        `GitHub API request without authentication: ${githubApiUrl}`,
      );
    }

    const response = await axios.get(githubApiUrl, { headers });

    res.json(response.data);
  } catch (error: any) {
    console.error("Error fetching repository info:", error);
    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch repository information";
    res.status(statusCode).json({
      error: errorMessage,
      details: error.response?.data || error.message,
    });
  }
});

export { router as githubRoutes };
