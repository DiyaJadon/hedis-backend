import dotenv from "dotenv";

// ✅ Load env FIRST
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 5000;

// ================= START SERVER =================
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

// ================= ERROR HANDLING =================
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});

// ================= GRACEFUL SHUTDOWN =================
process.on("SIGINT", () => {
  console.log("🛑 Server shutting down...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});