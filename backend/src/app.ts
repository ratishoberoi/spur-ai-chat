import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "spur-ai-chat-backend" });
});

// Global error handler (foundation)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    error: "Something went wrong. Please try again later."
  });
});

export default app;
