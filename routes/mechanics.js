const express = require("express")
const router = express.Router()
const Mechanic = require("../models/Mechanic")
const Maintenance = require("../models/Maintenance")
const { generateWalletAddress, generatePrivateKey } = require("../utils/blockchain")
const { validateMechanic } = require("../middleware/validation")

// GET /api/mechanics - Get all mechanics
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, specialty, status } = req.query
    const query = { isActive: true }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    if (specialty) {
      query.specialties = { $in: [specialty] }
    }

    if (status) {
      query["availability.status"] = status
    }

    const mechanics = await Mechanic.find(query)
      .select("-password -privateKey")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 })

    const total = await Mechanic.countDocuments(query)

    res.json({
      mechanics,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/mechanics/:id - Get single mechanic
router.get("/:id", async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id)
      .select("-password -privateKey")
      .populate("workHistory.maintenance", "workOrder type completedDate")

    if (!mechanic) {
      return res.status(404).json({ error: "Mechanic not found" })
    }

    // Get current assignments
    const currentTasks = await Maintenance.find({
      assignedTo: req.params.id,
      status: { $in: ["scheduled", "in-progress"] },
    }).populate("aircraft", "registration model")

    res.json({
      ...mechanic.toJSON(),
      currentTasks,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/mechanics - Create new mechanic
router.post("/", validateMechanic, async (req, res) => {
  try {
    // Generate blockchain wallet
    const walletAddress = generateWalletAddress()
    const privateKey = generatePrivateKey()

    const mechanic = new Mechanic({
      ...req.body,
      walletAddress,
      privateKey,
    })

    await mechanic.save()

    // Remove sensitive data from response
    const response = mechanic.toJSON()
    delete response.password
    delete response.privateKey

    res.status(201).json(response)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email or employee ID already exists" })
    }
    res.status(400).json({ error: error.message })
  }
})

// PUT /api/mechanics/:id - Update mechanic
router.put("/:id", async (req, res) => {
  try {
    // Don't allow updating sensitive fields through this endpoint
    delete req.body.password
    delete req.body.walletAddress
    delete req.body.privateKey

    const mechanic = await Mechanic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password -privateKey")

    if (!mechanic) {
      return res.status(404).json({ error: "Mechanic not found" })
    }

    res.json(mechanic)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// POST /api/mechanics/:id/update-performance
router.post("/:id/update-performance", async (req, res) => {
  try {
    const { qualityScore, onTimeCompletion, complianceRate, rating, feedback } = req.body

    const mechanic = await Mechanic.findById(req.params.id)
    if (!mechanic) {
      return res.status(404).json({ error: "Mechanic not found" })
    }

    // Update performance metrics
    if (qualityScore !== undefined) mechanic.performance.qualityScore = qualityScore
    if (onTimeCompletion !== undefined) mechanic.performance.onTimeCompletion = onTimeCompletion
    if (complianceRate !== undefined) mechanic.performance.complianceRate = complianceRate

    // Update overall rating
    if (rating !== undefined) {
      const totalRatings = mechanic.workHistory.length
      const currentRatingSum = mechanic.rating * totalRatings
      mechanic.rating = (currentRatingSum + rating) / (totalRatings + 1)
    }

    // Calculate reputation score
    const performanceAvg =
      (mechanic.performance.qualityScore +
        mechanic.performance.onTimeCompletion +
        mechanic.performance.complianceRate) /
      3

    mechanic.reputationScore = Math.round(performanceAvg * 10)

    await mechanic.save()

    res.json({
      performance: mechanic.performance,
      rating: mechanic.rating,
      reputationScore: mechanic.reputationScore,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET /api/mechanics/:id/work-history
router.get("/:id/work-history", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const workHistory = await Maintenance.find({ assignedTo: req.params.id })
      .populate("aircraft", "registration model")
      .sort({ completedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Maintenance.countDocuments({ assignedTo: req.params.id })

    res.json({
      workHistory,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/mechanics/:id/add-certification
router.post("/:id/add-certification", async (req, res) => {
  try {
    const { name, number, issuedBy, issuedDate, expiryDate } = req.body

    const mechanic = await Mechanic.findById(req.params.id)
    if (!mechanic) {
      return res.status(404).json({ error: "Mechanic not found" })
    }

    mechanic.certifications.push({
      name,
      number,
      issuedBy,
      issuedDate: new Date(issuedDate),
      expiryDate: new Date(expiryDate),
      status: "active",
    })

    await mechanic.save()

    res.json(mechanic.certifications)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET /api/mechanics/statistics
router.get("/statistics", async (req, res) => {
  try {
    const totalMechanics = await Mechanic.countDocuments({ isActive: true })
    const activeMechanics = await Mechanic.countDocuments({
      isActive: true,
      "availability.status": "available",
    })

    const avgRating = await Mechanic.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ])

    const totalCertifications = await Mechanic.aggregate([
      { $match: { isActive: true } },
      { $project: { certCount: { $size: "$certifications" } } },
      { $group: { _id: null, total: { $sum: "$certCount" } } },
    ])

    const specialtyStats = await Mechanic.aggregate([
      { $match: { isActive: true } },
      { $unwind: "$specialties" },
      { $group: { _id: "$specialties", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    res.json({
      totalMechanics,
      activeMechanics,
      averageRating: avgRating[0]?.avgRating?.toFixed(1) || 0,
      totalCertifications: totalCertifications[0]?.total || 0,
      specialtyBreakdown: specialtyStats,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
