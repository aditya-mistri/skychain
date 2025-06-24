const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const { Web3 } = require("web3")
const crypto = require("crypto")

// Import routes
const aircraftRoutes = require("./routes/aircraft")
const partsRoutes = require("./routes/parts")
const maintenanceRoutes = require("./routes/maintenance")
const mechanicRoutes = require("./routes/mechanics")
const blockchainRoutes = require("./routes/blockchain")
const analyticsRoutes = require("./routes/analytics")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/skychain", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Web3 Setup (using Ganache or local blockchain)
const web3 = new Web3(process.env.WEB3_PROVIDER_URL || "http://localhost:8545")

// Make web3 available globally
app.locals.web3 = web3

// Routes
app.use("/api/aircraft", aircraftRoutes)
app.use("/api/parts", partsRoutes)
app.use("/api/maintenance", maintenanceRoutes)
app.use("/api/mechanics", mechanicRoutes)
app.use("/api/blockchain", blockchainRoutes)
app.use("/api/analytics", analyticsRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    blockchain: "Active",
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`🚀 SkyChain Backend Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
