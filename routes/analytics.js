const express = require("express")
const router = express.Router()
const Aircraft = require("../models/Aircraft")
const Part = require("../models/Part")
const Maintenance = require("../models/Maintenance")
const Mechanic = require("../models/Mechanic")
const BlockchainTransaction = require("../models/BlockchainTransaction")

// GET /api/analytics/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    // Key Performance Indicators
    const totalAircraft = await Aircraft.countDocuments()
    const compliantAircraft = await Aircraft.countDocuments({ status: "compliant" })
    const alertAircraft = await Aircraft.countDocuments({ status: "alert" })
    const overdueAircraft = await Aircraft.countDocuments({ status: "overdue" })

    const totalParts = await Part.countDocuments()
    const authenticParts = await Part.countDocuments({ status: "authentic" })
    const counterfeitParts = await Part.countDocuments({ status: "counterfeit" })

    const totalMaintenance = await Maintenance.countDocuments()
    const completedMaintenance = await Maintenance.countDocuments({ status: "completed" })
    const overdueMaintenance = await Maintenance.countDocuments({ status: "overdue" })

    // Calculate savings (simulated)
    const traditionalCost = totalAircraft * 50000 // $50k per aircraft traditional maintenance
    const skyChainCost = totalAircraft * 10000 // $10k per aircraft with SkyChain
    const totalSavings = traditionalCost - skyChainCost
    const savingsPercentage = ((totalSavings / traditionalCost) * 100).toFixed(1)

    // Compliance rate
    const complianceRate = totalAircraft > 0 ? ((compliantAircraft / totalAircraft) * 100).toFixed(1) : 0

    // Part authenticity rate
    const authenticityRate = totalParts > 0 ? ((authenticParts / totalParts) * 100).toFixed(1) : 0

    res.json({
      kpis: {
        totalAircraft,
        compliantAircraft,
        alertAircraft,
        overdueAircraft,
        complianceRate: Number.parseFloat(complianceRate),
        totalParts,
        authenticParts,
        counterfeitParts,
        authenticityRate: Number.parseFloat(authenticityRate),
        totalMaintenance,
        completedMaintenance,
        overdueMaintenance,
        totalSavings,
        savingsPercentage: Number.parseFloat(savingsPercentage),
      },
      costReduction: {
        traditional: traditionalCost,
        skyChain: skyChainCost,
        savings: totalSavings,
        percentage: Number.parseFloat(savingsPercentage),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/analytics/fleet-performance
router.get("/fleet-performance", async (req, res) => {
  try {
    const fleetStats = await Aircraft.aggregate([
      {
        $group: {
          _id: "$manufacturer",
          count: { $sum: 1 },
          compliant: {
            $sum: { $cond: [{ $eq: ["$status", "compliant"] }, 1, 0] },
          },
          avgFlightHours: { $avg: "$flightHours" },
        },
      },
      {
        $project: {
          manufacturer: "$_id",
          count: 1,
          compliant: 1,
          complianceRate: {
            $multiply: [{ $divide: ["$compliant", "$count"] }, 100],
          },
          avgFlightHours: { $round: ["$avgFlightHours", 0] },
          estimatedSavings: { $multiply: ["$count", 2100000] }, // $2.1M per aircraft
        },
      },
      { $sort: { count: -1 } },
    ])

    res.json(fleetStats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/analytics/maintenance-trends
router.get("/maintenance-trends", async (req, res) => {
  try {
    const { months = 6 } = req.query
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    const trends = await Maintenance.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalTasks: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          overdue: {
            $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] },
          },
          avgHours: { $avg: "$actualHours" },
          totalCost: { $sum: "$cost.total" },
        },
      },
      {
        $project: {
          month: "$_id.month",
          year: "$_id.year",
          totalTasks: 1,
          completed: 1,
          overdue: 1,
          completionRate: {
            $multiply: [{ $divide: ["$completed", "$totalTasks"] }, 100],
          },
          avgHours: { $round: ["$avgHours", 1] },
          totalCost: 1,
          estimatedSavings: { $multiply: ["$totalTasks", 15000] }, // $15k savings per task
        },
      },
      { $sort: { year: 1, month: 1 } },
    ])

    res.json(trends)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/analytics/mechanic-performance
router.get("/mechanic-performance", async (req, res) => {
  try {
    const performance = await Mechanic.aggregate([
      {
        $match: { isActive: true },
      },
      {
        $project: {
          name: 1,
          employeeId: 1,
          tasksCompleted: 1,
          rating: 1,
          reputationScore: 1,
          qualityScore: "$performance.qualityScore",
          onTimeCompletion: "$performance.onTimeCompletion",
          complianceRate: "$performance.complianceRate",
          overallPerformance: {
            $avg: ["$performance.qualityScore", "$performance.onTimeCompletion", "$performance.complianceRate"],
          },
        },
      },
      { $sort: { overallPerformance: -1 } },
    ])

    res.json(performance)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/analytics/blockchain-metrics
router.get("/blockchain-metrics", async (req, res) => {
  try {
    const totalTransactions = await BlockchainTransaction.countDocuments()
    const confirmedTransactions = await BlockchainTransaction.countDocuments({ status: "confirmed" })
    const pendingTransactions = await BlockchainTransaction.countDocuments({ status: "pending" })

    const transactionTypes = await BlockchainTransaction.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    const dailyTransactions = await BlockchainTransaction.aggregate([
      {
        $match: {
          timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
          },
          count: { $sum: 1 },
          avgGasUsed: { $avg: "$gasUsed" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ])

    const networkUptime = 99.99 // Simulated
    const avgBlockTime = 2.3 // Simulated
    const hashRate = "156.7 TH/s" // Simulated

    res.json({
      totalTransactions,
      confirmedTransactions,
      pendingTransactions,
      confirmationRate: totalTransactions > 0 ? ((confirmedTransactions / totalTransactions) * 100).toFixed(1) : 0,
      transactionTypes,
      dailyTransactions,
      networkMetrics: {
        uptime: networkUptime,
        avgBlockTime,
        hashRate,
        gasPrice: "21 gwei",
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/analytics/roi-calculator
router.get("/roi-calculator", async (req, res) => {
  try {
    const { fleetSize = 100 } = req.query

    // Traditional maintenance costs (annual)
    const traditionalCosts = {
      maintenanceErrors: fleetSize * 180000, // $180k per aircraft
      complianceAudits: fleetSize * 45000, // $45k per aircraft
      counterfeitParts: fleetSize * 25000, // $25k per aircraft
      insurancePremiums: fleetSize * 35000, // $35k per aircraft
      regulatoryFines: fleetSize * 15000, // $15k per aircraft
      total: 0,
    }
    traditionalCosts.total = Object.values(traditionalCosts).reduce(
      (sum, cost) => (typeof cost === "number" ? sum + cost : sum),
      0,
    )

    // SkyChain costs (annual)
    const skyChainCosts = {
      platformLicense: fleetSize * 12000, // $12k per aircraft
      blockchainFees: fleetSize * 3000, // $3k per aircraft
      training: fleetSize * 2000, // $2k per aircraft
      implementation: fleetSize * 8000, // $8k per aircraft (one-time, amortized)
      total: 0,
    }
    skyChainCosts.total = Object.values(skyChainCosts).reduce(
      (sum, cost) => (typeof cost === "number" ? sum + cost : sum),
      0,
    )

    // Savings breakdown
    const savings = {
      maintenanceErrorReduction: traditionalCosts.maintenanceErrors * 0.8, // 80% reduction
      fasterComplianceAudits: traditionalCosts.complianceAudits * 0.95, // 95% reduction
      counterfeitPrevention: traditionalCosts.counterfeitParts * 1.0, // 100% prevention
      insurancePremiumReduction: traditionalCosts.insurancePremiums * 0.3, // 30% reduction
      regulatoryFineAvoidance: traditionalCosts.regulatoryFines * 0.8, // 80% reduction
      total: 0,
    }
    savings.total = Object.values(savings).reduce((sum, saving) => (typeof saving === "number" ? sum + saving : sum), 0)

    const netSavings = savings.total - skyChainCosts.total
    const roi = ((netSavings / skyChainCosts.total) * 100).toFixed(1)
    const paybackPeriod = (skyChainCosts.total / (netSavings / 12)).toFixed(1) // months

    res.json({
      fleetSize: Number.parseInt(fleetSize),
      traditionalCosts,
      skyChainCosts,
      savings,
      netSavings,
      roi: Number.parseFloat(roi),
      paybackPeriod: Number.parseFloat(paybackPeriod),
      costReductionPercentage: ((netSavings / traditionalCosts.total) * 100).toFixed(1),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
