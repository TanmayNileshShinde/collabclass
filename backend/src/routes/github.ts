import { Router } from "express";
import { verifyToken } from "@clerk/clerk-sdk-node";
import axios from "axios";
const router = Router();

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
router.get("/repo/:owner/:repo/contents/*", verifyAuth, async (req: any, res) => {
  try {
    const { owner, repo } = req.params;
    const path = req.params[0] || ""; // Get the rest of the path
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    const response = await axios.get(githubApiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CollabClass-App'
      }
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Error fetching repository contents:", error);
    res.status(500).json({ 
      error: "Failed to fetch repository contents",
      details: error.response?.data?.message || error.message 
    });
  }
});

// Get repository root contents
router.get("/repo/:owner/:repo/contents", verifyAuth, async (req: any, res) => {
  try {
    const { owner, repo } = req.params;
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
    
    const response = await axios.get(githubApiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CollabClass-App'
      }
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Error fetching repository root contents:", error);
    res.status(500).json({ 
      error: "Failed to fetch repository root contents",
      details: error.response?.data?.message || error.message 
    });
  }
});

// Get repository information (this must come after the contents route)
router.get("/repo/:owner/:repo", verifyAuth, async (req: any, res) => {
  try {
    const { owner, repo } = req.params;
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    
    const response = await axios.get(githubApiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CollabClass-App'
      }
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Error fetching repository info:", error);
    res.status(500).json({ 
      error: "Failed to fetch repository information",
      details: error.response?.data?.message || error.message 
    });
  }
});

export { router as githubRoutes };
