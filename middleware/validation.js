const Joi = require("joi")

// Aircraft validation schema
const aircraftSchema = Joi.object({
  registration: Joi.string().required().trim().uppercase(),
  model: Joi.string().required().trim(),
  manufacturer: Joi.string().required().trim(),
  yearBuilt: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  flightHours: Joi.number().min(0).default(0),
  lastMaintenance: Joi.date().default(Date.now),
  nextMaintenance: Joi.date().required(),
  location: Joi.string().required().trim(),
  status: Joi.string().valid("compliant", "alert", "overdue", "grounded").default("compliant"),
})

// Part validation schema
const partSchema = Joi.object({
  partNumber: Joi.string().required().trim().uppercase(),
  name: Joi.string().required().trim(),
  manufacturer: Joi.string().required().trim(),
  serialNumber: Joi.string().required().trim(),
  aircraft: Joi.string().required(), // MongoDB ObjectId
  installDate: Joi.date().required(),
  location: Joi.string().required().trim(),
  nextInspection: Joi.date().required(),
  status: Joi.string().valid("authentic", "counterfeit", "pending", "retired").default("pending"),
})

// Maintenance validation schema
const maintenanceSchema = Joi.object({
  aircraft: Joi.string().required(), // MongoDB ObjectId
  type: Joi.string()
    .required()
    .valid(
      "Scheduled Inspection",
      "Engine Service",
      "Avionics Check",
      "Landing Gear Service",
      "Hydraulic Service",
      "Emergency Repair",
      "Compliance Check",
      "Parts Replacement",
    ),
  description: Joi.string().required().trim(),
  priority: Joi.string().valid("low", "medium", "high", "critical").default("medium"),
  assignedTo: Joi.string().required(), // MongoDB ObjectId
  scheduledDate: Joi.date().required(),
  dueDate: Joi.date().required(),
  estimatedHours: Joi.number().min(0).required(),
  checklist: Joi.array()
    .items(
      Joi.object({
        task: Joi.string().required(),
        completed: Joi.boolean().default(false),
      }),
    )
    .default([]),
})

// Mechanic validation schema
const mechanicSchema = Joi.object({
  employeeId: Joi.string().required().trim(),
  name: Joi.string().required().trim(),
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(6).required(),
  certifications: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        number: Joi.string(),
        issuedBy: Joi.string(),
        issuedDate: Joi.date(),
        expiryDate: Joi.date(),
        status: Joi.string().valid("active", "expired", "suspended").default("active"),
      }),
    )
    .default([]),
  specialties: Joi.array().items(Joi.string().trim()).default([]),
})

// Validation middleware functions
const validateAircraft = (req, res, next) => {
  const { error } = aircraftSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      error: "Validation error",
      details: error.details.map((detail) => detail.message),
    })
  }
  next()
}

const validatePart = (req, res, next) => {
  const { error } = partSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      error: "Validation error",
      details: error.details.map((detail) => detail.message),
    })
  }
  next()
}

const validateMaintenance = (req, res, next) => {
  const { error } = maintenanceSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      error: "Validation error",
      details: error.details.map((detail) => detail.message),
    })
  }
  next()
}

const validateMechanic = (req, res, next) => {
  const { error } = mechanicSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      error: "Validation error",
      details: error.details.map((detail) => detail.message),
    })
  }
  next()
}

module.exports = {
  validateAircraft,
  validatePart,
  validateMaintenance,
  validateMechanic,
}
