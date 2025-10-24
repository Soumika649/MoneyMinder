import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";

import authRoutes from "./routes/auth.js";
import goalsRoutes from "./routes/goals.js";
import transactionsRoutes from "./routes/transactions.js";
import budgetsRoutes from "./routes/budgets.js";
import investmentsRoutes from "./routes/investments.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files

// --------------------
// MongoDB Connection
// --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// --------------------
// Multer setup (for CSV uploads)
// --------------------
export const upload = multer({ dest: "uploads/" });

// --------------------
// Routes
// --------------------
app.use("/api", authRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/budgets", budgetsRoutes);
app.use("/api/investments", investmentsRoutes);



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend build files
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});


// --------------------
// Global error handler
// --------------------
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

