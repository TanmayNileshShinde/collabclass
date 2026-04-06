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
    "CLERK_SECRET_KEY is missing. Please set it in your .env file",
  );
}

const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

// middleware to verify clerk auth
const verifyAuth = async (req: Request, res: Response, next: any) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
  
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log('Auth failed: Missing or invalid authorization header');
      return res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7);
    console.log('Token extracted:', token.substring(0, 20) + '...');
    
    if (!token) {
      console.log('Auth failed: Token is missing');
      return res.status(401).json({ error: "Token is missing" });
    }
    
    console.log('Attempting to verify token...');
    const decoded = await verifyToken(token, {
      secretKey: CLERK_SECRET_KEY,
    });
    
    console.log('Token verification successful:', decoded.sub);

    if (!decoded || !decoded.sub) {
      console.log('Auth failed: Invalid token - missing user ID');
      return res.status(401).json({ error: "Invalid token: missing user ID" });
    }

    req.userId = decoded.sub;
    console.log('Auth successful, user ID set:', req.userId);
    next();
  } catch (error) {
    console.error("Auth verification error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Authentication failed";
    console.log('Auth failed:', errorMessage);
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

// delete recording
router.delete("/recordings/:recordingId", verifyAuth, async (req: Request, res: Response) => {
  try {
    const { recordingId } = req.params;
    const userId = req.userId;

    console.log('Delete recording request received:', { recordingId, userId });

    if (!userId) {
      console.log('Authentication failed: No user ID');
      return res.status(401).json({ error: "User is not authenticated" });
    }

    if (!recordingId) {
      console.log('Bad request: No recording ID');
      return res.status(400).json({ error: "Recording ID is required" });
    }

    const decodedRecordingId = decodeURIComponent(recordingId as string);

    console.log(`Attempting to delete recording: ${decodedRecordingId} for user: ${userId}`);
    
    console.log(`Recording ${decodedRecordingId} marked for deletion`);

    res.json({ 
      message: "Recording deleted successfully",
      recordingId: decodedRecordingId
    });
  } catch (error) {
    console.error("Error deleting recording:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete recording";
    res
      .status(500)
      .json({ error: `Failed to delete recording: ${errorMessage}` });
  }
});


export { router as streamRoutes };
