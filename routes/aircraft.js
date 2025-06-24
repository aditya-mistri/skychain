const express = require("express")
const router = express.Router()
const Aircraft = require("../models/Aircraft")
const Part = require("../models/Part")
const Maintenance = require("../models/Maintenance")
const { generateBlockchainHash, generateQRCode } = require("../utils/blockchain")
const { validateAircraft } = require("../middleware/validation")

// GET /api/aircraft - Get all aircraft
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query
    const query = {}

    if (status) query.status = status
    if (search) {
      query.$or = [
        { registration: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { manufacturer: { $regex: search, $options: "i" } },
      ]
    }

    const aircraft = await Aircraft.find(query)
      .populate("parts", "partNumber name status")
      .populate("maintenanceHistory", "workOrder type status dueDate")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Aircraft.countDocuments(query)

    res.json({
      aircraft,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/aircraft/:id - Get single aircraft
router.get("/:id", async (req, res) => {
  try {
    const aircraft = await Aircraft.findById(req.params.id)
      .populate("parts")
      .populate({
        path: "maintenanceHistory",
        populate: {
          path: "assignedTo",
          select: "name employeeId",
        },
      })

    if (!aircraft) {
      return res.status(404).json({ error: "Aircraft not found" })
    }

    res.json(aircraft)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/aircraft - Create new aircraft
router.post("/", validateAircraft, async (req, res) => {
  try {
    const blockchainHash = generateBlockchainHash({
      registration: req.body.registration,
      model: req.body.model,
      timestamp: Date.now(),
    })

    const qrCode = await generateQRCode({
      type: "aircraft",
      registration: req.body.registration,
      hash: blockchainHash,
    })

    const aircraft = new Aircraft({
      ...req.body,
      blockchainHash,
      qrCode,
    })

    await aircraft.save()

    // Simulate blockchain transaction
    const web3 = req.app.locals.web3
    const accounts = await web3.eth.getAccounts()

    const transactionData = {
      from: accounts[0],
      to: process.env.AIRCRAFT_CONTRACT_ADDRESS || accounts[1],
      data: web3.utils.toHex(
        JSON.stringify({
          registration: aircraft.registration,
          model: aircraft.model,
          hash: blockchainHash,
        }),
      ),
      gas: 100000,
    }

    // In production, this would be a real blockchain transaction
    console.log("Blockchain transaction simulated:", transactionData)

    res.status(201).json(aircraft)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// PUT /api/aircraft/:id - Update aircraft
router.put("/:id", validateAircraft, async (req, res) => {
  try {
    const aircraft = await Aircraft.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!aircraft) {
      return res.status(404).json({ error: "Aircraft not found" })
    }

    res.json(aircraft)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE /api/aircraft/:id - Delete aircraft
router.delete("/:id", async (req, res) => {
  try {
    const aircraft = await Aircraft.findByIdAndDelete(req.params.id)

    if (!aircraft) {
      return res.status(404).json({ error: "Aircraft not found" })
    }

    // Also delete related parts and maintenance records
    await Part.deleteMany({ aircraft: req.params.id })
    await Maintenance.deleteMany({ aircraft: req.params.id })

    res.json({ message: "Aircraft deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/aircraft/:id/maintenance-history
router.get("/:id/maintenance-history", async (req, res) => {
  try {
    const maintenanceHistory = await Maintenance.find({ aircraft: req.params.id })
      .populate("assignedTo", "name employeeId")
      .sort({ createdAt: -1 })

    res.json(maintenanceHistory)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/aircraft/:id/parts
router.get("/:id/parts", async (req, res) => {
  try {
    const parts = await Part.find({ aircraft: req.params.id }).sort({ installDate: -1 })

    res.json(parts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/aircraft/:id/generate-qr
router.post("/:id/generate-qr", async (req, res) => {
  try {
    const aircraft = await Aircraft.findById(req.params.id)

    if (!aircraft) {
      return res.status(404).json({ error: "Aircraft not found" })
    }

    const qrCode = await generateQRCode({
      type: "aircraft",
      registration: aircraft.registration,
      hash: aircraft.blockchainHash,
      timestamp: Date.now(),
    })

    aircraft.qrCode = qrCode
    await aircraft.save()

    res.json({ qrCode })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
