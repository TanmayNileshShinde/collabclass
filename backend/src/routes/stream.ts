import { Router } from "express";
import { verifyToken } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";
import { StreamClient } from "@stream-io/node-sdk";
import dotenv from "dotenv";
dotenv.config();
const router = Router();

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!STREAM_API_KEY || !STREAM_API_SECRET) {
  throw new Error("Stream API credentials are missing");
}

if (!CLERK_SECRET_KEY) {
  throw new Error(
    "CLERK_SECRET_KEY is missing. Please set it in your .env file"
  );
}

const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

// middleware to verify clerk auth
const verifyAuth = async (req: Request, res: Response, next: any) => {
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
      secretKey: CLERK_SECRET_KEY,
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

// get stream token
router.post("/token", verifyAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "User is not authenticated" });
    }

    const expirationTime = Math.floor(Date.now() / 1000) + 3600;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    // Create token with admin role to allow all participants to update calls
    const token = streamClient.createToken(userId, expirationTime, issuedAt);

    res.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate token";
    res
      .status(500)
      .json({ error: `Failed to generate token: ${errorMessage}` });
  }
});

export { router as streamRoutes };
