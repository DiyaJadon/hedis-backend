import express from "express";
import cors from "cors";

import productRoutes from "./routes/products.routes.js";
import enquiryRoutes from "./routes/enquiry.routes.js";

const app = express();

/* ================= MIDDLEWARE ================= */

// Parse JSON request bodies
app.use(express.json());

// ✅ TEMPORARY: allow all origins (for deployment phase)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

/* ================= ROUTES ================= */

// Product APIs
app.use("/api/products", productRoutes);

// Enquiry / Contact form API
app.use("/api/enquiry", enquiryRoutes);

// ✅ SINGLE health check (keep only here)
app.get("/", (req, res) => {
  res.status(200).send("✅ HEDIS Backend is running");
});

/* ================= FALLBACK ================= */

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;