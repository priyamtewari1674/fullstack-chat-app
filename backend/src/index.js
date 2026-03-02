import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      process.env.CORS_ORIGIN ||
      "http://localhost:5173",
    credentials: true,
  }),
);

const PORT = process.env.PORT || 5001;
console.log(PORT);

if (!process.env.JWT_SECRET) {
  console.error(
    "FATAL: JWT_SECRET environment variable is not set. Login/signup will fail.",
  );
}
if (!process.env.MONGODB_URI) {
  console.error(
    "FATAL: MONGODB_URI environment variable is not set. Database will not connect.",
  );
}

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT: " + PORT);
  connectDB();
});
