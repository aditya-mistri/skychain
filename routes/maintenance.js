const express = require("express")
const router = express.Router()
const Maintenance = require("../models/Maintenance")
const Aircraft = require("../models/Aircraft")
const Mechanic = require("../models/Mechanic")
const { generateBlockchainHash, createDigitalSignature } = require("../utils/blockchain")
const { validateMaintenance } = require("../middleware/validation")

// GET /api/maintenance - Get all maintenance records
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, aircraft, mechanic } = req.query
    const query = {}

    if (status) query.status = status
    if (priority) query.priority = priority
    if (aircraft) query.aircraft = aircraft
    if (mechanic) query.assignedTo = mechanic

    const maintenance = await Maintenance.find(query)
      .populate("aircraft", "registration model")
      .populate("assignedTo", "name employeeId")
      .populate("parts.part", "partNumber name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ dueDate: 1 })

    const total = await Maintenance.countDocuments(query)

    res.json({
      maintenance,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/maintenance/:id - Get single maintenance record
router.get("/:id", async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)
      .populate("aircraft")
      .populate("assignedTo")
      .populate("parts.part")
      .populate("checklist.completedBy", "name employeeId")

    if (!maintenance) {
      return res.status(404).json({ error: "Maintenance record not found" })
    }

    res.json(maintenance)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/maintenance - Create new maintenance record
router.post("/", validateMaintenance, async (req, res) => {
  try {
    // Verify aircraft and mechanic exist
    const aircraft = await Aircraft.findById(req.body.aircraft)
    const mechanic = await Mechanic.findById(req.body.assignedTo)

    if (!aircraft) {
      return res.status(400).json({ error: "Aircraft not found" })
    }
    if (!mechanic) {
      return res.status(400).json({ error: "Mechanic not found" })
    }

    // Generate unique work order number
    const workOrderCount = await Maintenance.countDocuments()
    const workOrder = `WO-${new Date().getFullYear()}-${String(workOrderCount + 1).padStart(4, "0")}`

    const maintenance = new Maintenance({
      ...req.body,
      workOrder,
    })

    await maintenance.save()

    // Add to aircraft maintenance history
    aircraft.maintenanceHistory.push(maintenance._id)
    await aircraft.save()

    // Update mechanic task count
    mechanic.tasksInProgress += 1
    await mechanic.save()

    res.status(201).json(maintenance)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// PUT /api/maintenance/:id - Update maintenance record
router.put("/:id", async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!maintenance) {
      return res.status(404).json({ error: "Maintenance record not found" })
    }

    res.json(maintenance)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// POST /api/maintenance/:id/complete-task
router.post("/:id/complete-task", async (req, res) => {
  try {
    const { taskIndex, mechanicId, notes } = req.body

    const maintenance = await Maintenance.findById(req.params.id)
    if (!maintenance) {
      return res.status(404).json({ error: "Maintenance record not found" })
    }

    if (taskIndex >= maintenance.checklist.length) {
      return res.status(400).json({ error: "Invalid task index" })
    }

    maintenance.checklist[taskIndex].completed = true
    maintenance.checklist[taskIndex].completedBy = mechanicId
    maintenance.checklist[taskIndex].completedAt = new Date()
    maintenance.checklist[taskIndex].notes = notes

    // Check if all tasks are completed
    const allCompleted = maintenance.checklist.every((task) => task.completed)
    if (allCompleted && maintenance.status === "in-progress") {
      maintenance.status = "completed"
      maintenance.completedDate = new Date()

      // Update mechanic stats
      const mechanic = await Mechanic.findById(maintenance.assignedTo)
      if (mechanic) {
        mechanic.tasksCompleted += 1
        mechanic.tasksInProgress = Math.max(0, mechanic.tasksInProgress - 1)
        await mechanic.save()
      }

      // Update aircraft next maintenance date
      const aircraft = await Aircraft.findById(maintenance.aircraft)
      if (aircraft && maintenance.type === "Scheduled Inspection") {
        const nextMaintenanceDate = new Date()
        nextMaintenanceDate.setMonth(nextMaintenanceDate.getMonth() + 3) // 3 months from now
        aircraft.nextMaintenance = nextMaintenanceDate
        aircraft.lastMaintenance = new Date()
        await aircraft.save()
      }
    }

    await maintenance.save()

    res.json(maintenance)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// POST /api/maintenance/:id/digital-signature
router.post("/:id/digital-signature", async (req, res) => {
  try {
    const { mechanicId, supervisorId } = req.body

    const maintenance = await Maintenance.findById(req.params.id)
    if (!maintenance) {
      return res.status(404).json({ error: "Maintenance record not found" })
    }

    const mechanic = await Mechanic.findById(mechanicId)
    if (!mechanic) {
      return res.status(400).json({ error: "Mechanic not found" })
    }

    // Create digital signature
    const signatureData = {
      workOrder: maintenance.workOrder,
      mechanicId,
      supervisorId,
      timestamp: new Date(),
      maintenanceData: {
        type: maintenance.type,
        aircraft: maintenance.aircraft,
        completedTasks: maintenance.checklist.filter((task) => task.completed).length,
      },
    }

    const digitalSignature = createDigitalSignature(signatureData)

    maintenance.digitalSignature = {
      mechanic: mechanicId,
      supervisor: supervisorId,
      timestamp: new Date(),
      hash: digitalSignature,
    }

    // Create blockchain record
    const blockchainHash = generateBlockchainHash(signatureData)
    maintenance.blockchainRecord = {
      transactionHash: blockchainHash,
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000, // Simulated
      gasUsed: 21000,
      timestamp: new Date(),
    }

    await maintenance.save()

    // Update mechanic blockchain signatures count
    mechanic.blockchainSignatures += 1
    await mechanic.save()

    res.json({
      digitalSignature: maintenance.digitalSignature,
      blockchainRecord: maintenance.blockchainRecord,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/maintenance/statistics
router.get("/statistics", async (req, res) => {
  try {
    const totalTasks = await Maintenance.countDocuments()
    const completedTasks = await Maintenance.countDocuments({ status: "completed" })
    const overdueTasks = await Maintenance.countDocuments({ status: "overdue" })
    const inProgressTasks = await Maintenance.countDocuments({ status: "in-progress" })

    const priorityStats = await Maintenance.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ])

    const typeStats = await Maintenance.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          avgHours: { $avg: "$actualHours" },
        },
      },
    ])

    res.json({
      totalTasks,
      completedTasks,
      overdueTasks,
      inProgressTasks,
      completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0,
      priorityBreakdown: priorityStats,
      typeBreakdown: typeStats,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/maintenance/calendar/:year/:month
router.get("/calendar/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const maintenance = await Maintenance.find({
      $or: [{ scheduledDate: { $gte: startDate, $lte: endDate } }, { dueDate: { $gte: startDate, $lte: endDate } }],
    })
      .populate("aircraft", "registration model")
      .populate("assignedTo", "name")
      .sort({ scheduledDate: 1 })

    res.json(maintenance)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
