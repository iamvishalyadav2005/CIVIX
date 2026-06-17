const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");
const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://civix-frontend.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        if (origin.endsWith(".vercel.app")) {
          return callback(null, true);
        }
        return callback(new Error("CORS policy blocked access"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", require("./routes/messages"));
app.use("/api/chat-history", chatRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running and HTTPS is working!");
});

module.exports = app;
