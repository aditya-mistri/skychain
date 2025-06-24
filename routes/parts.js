const express = require("express")
const router = express.Router()
const Part = require("../models/Part")
const Aircraft = require("../models/Aircraft")
const { generateBlockchainHash, generateQRCode, verifyPartAuthenticity } = require("../utils/blockchain")
const { validatePart } = require("../middleware/validation")

// GET /api/parts - Get all parts
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, aircraft } = req.query
    const query = {}

    if (status) query.status = status
    if (aircraft) query.aircraft = aircraft
    if (search) {
      query.$or = [
        { partNumber: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { serialNumber: { $regex: search, $options: "i" } },
        { manufacturer: { $regex: search, $options: "i" } },
      ]
    }

    const parts = await Part.find(query)
      .populate("aircraft", "registration model")
      .populate("lifecycle.installed.mechanic", "name employeeId")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Part.countDocuments(query)

    res.json({
      parts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/parts/:id - Get single part
router.get("/:id", async (req, res) => {
  try {
    const part = await Part.findById(req.params.id)
      .populate("aircraft", "registration model manufacturer")
      .populate("lifecycle.installed.mechanic", "name employeeId")
      .populate("lifecycle.inspections.mechanic", "name employeeId")

    if (!part) {
      return res.status(404).json({ error: "Part not found" })
    }

    res.json(part)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/parts - Create new part
router.post("/", validatePart, async (req, res) => {
  try {
    // Verify aircraft exists
    const aircraft = await Aircraft.findById(req.body.aircraft)
    if (!aircraft) {
      return res.status(400).json({ error: "Aircraft not found" })
    }

    const blockchainHash = generateBlockchainHash({
      partNumber: req.body.partNumber,
      serialNumber: req.body.serialNumber,
      manufacturer: req.body.manufacturer,
      timestamp: Date.now(),
    })

    const qrCode = await generateQRCode({
      type: "part",
      partNumber: req.body.partNumber,
      serialNumber: req.body.serialNumber,
      hash: blockchainHash,
    })

    const part = new Part({
      ...req.body,
      blockchainHash,
      qrCode,
      lifecycle: {
        manufactured: {
          date: req.body.manufacturedDate || new Date(),
          facility: req.body.manufacturingFacility,
          batchNumber: req.body.batchNumber,
        },
      },
    })

    await part.save()

    // Add part to aircraft
    aircraft.parts.push(part._id)
    await aircraft.save()

    // Simulate blockchain transaction for part registration
    const web3 = req.app.locals.web3
    const accounts = await web3.eth.getAccounts()

    console.log("Part blockchain registration simulated:", {
      partNumber: part.partNumber,
      serialNumber: part.serialNumber,
      hash: blockchainHash,
    })

    res.status(201).json(part)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// PUT /api/parts/:id - Update part
router.put("/:id", validatePart, async (req, res) => {
  try {
    const part = await Part.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!part) {
      return res.status(404).json({ error: "Part not found" })
    }

    res.json(part)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// POST /api/parts/:id/verify-authenticity
router.post("/:id/verify-authenticity", async (req, res) => {
  try {
    const part = await Part.findById(req.params.id)

    if (!part) {
      return res.status(404).json({ error: "Part not found" })
    }

    // Simulate blockchain verification
    const isAuthentic = await verifyPartAuthenticity(part.blockchainHash, part.serialNumber)

    part.status = isAuthentic ? "authentic" : "counterfeit"
    part.authenticity = {
      verified: true,
      verificationDate: new Date(),
      verificationMethod: "blockchain",
      blockchainProof: part.blockchainHash,
    }

    await part.save()

    res.json({
      partId: part._id,
      isAuthentic,
      status: part.status,
      verificationDate: part.authenticity.verificationDate,
      blockchainProof: part.authenticity.blockchainProof,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/parts/:id/add-inspection
router.post("/:id/add-inspection", async (req, res) => {
  try {
    const { type, result, mechanicId, notes } = req.body

    const part = await Part.findById(req.params.id)
    if (!part) {
      return res.status(404).json({ error: "Part not found" })
    }

    part.lifecycle.inspections.push({
      date: new Date(),
      type,
      result,
      mechanic: mechanicId,
      notes,
    })

    await part.save()

    res.json(part)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// GET /api/parts/statistics
router.get("/statistics", async (req, res) => {
  try {
    const stats = await Part.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    const totalParts = await Part.countDocuments()
    const authenticParts = await Part.countDocuments({ status: "authentic" })
    const counterfeitParts = await Part.countDocuments({ status: "counterfeit" })
    const pendingParts = await Part.countDocuments({ status: "pending" })

    const verificationRate = totalParts > 0 ? ((authenticParts / totalParts) * 100).toFixed(1) : 0

    res.json({
      totalParts,
      authenticParts,
      counterfeitParts,
      pendingParts,
      verificationRate: Number.parseFloat(verificationRate),
      statusBreakdown: stats,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/parts/scan-qr
router.post("/scan-qr", async (req, res) => {
  try {
    const { qrCode } = req.body

    if (!qrCode) {
      return res.status(400).json({ error: "QR code is required" })
    }

    const part = await Part.findOne({ qrCode })
      .populate("aircraft", "registration model")
      .populate("lifecycle.installed.mechanic", "name employeeId")

    if (!part) {
      return res.status(404).json({ error: "Part not found for this QR code" })
    }

    // Verify authenticity on scan
    const isAuthentic = await verifyPartAuthenticity(part.blockchainHash, part.serialNumber)

    res.json({
      part,
      isAuthentic,
      scanTimestamp: new Date(),
      verificationStatus: isAuthentic ? "verified" : "failed",
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
