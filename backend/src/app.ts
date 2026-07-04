import express from "express";
import cors from "cors";
import path from "path";
import { config } from "./config";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files locally
app.use("/uploads", express.static(path.resolve(config.upload.dir)));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "DevDarshanMarg API" });
});

// API routes
app.use("/api", routes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
