const mongoose = require("mongoose")

const aircraftSchema = new mongoose.Schema(
  {
    registration: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
    yearBuilt: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },
    flightHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastMaintenance: {
      type: Date,
      default: Date.now,
    },
    nextMaintenance: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["compliant", "alert", "overdue", "grounded"],
      default: "compliant",
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    blockchainHash: {
      type: String,
      required: true,
      unique: true,
    },
    qrCode: {
      type: String,
      unique: true,
    },
    parts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part",
      },
    ],
    maintenanceHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Maintenance",
      },
    ],
    complianceStatus: {
      faa: {
        type: Boolean,
        default: true,
      },
      easa: {
        type: Boolean,
        default: true,
      },
      lastAudit: {
        type: Date,
        default: Date.now,
      },
    },
    digitalTwin: {
      enabled: {
        type: Boolean,
        default: true,
      },
      lastSync: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for days until next maintenance
aircraftSchema.virtual("daysUntilMaintenance").get(function () {
  const now = new Date()
  const nextMaintenance = new Date(this.nextMaintenance)
  const diffTime = nextMaintenance - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Pre-save middleware to update status based on maintenance dates
aircraftSchema.pre("save", function (next) {
  const now = new Date()
  const nextMaintenance = new Date(this.nextMaintenance)
  const daysUntil = Math.ceil((nextMaintenance - now) / (1000 * 60 * 60 * 24))

  if (daysUntil < 0) {
    this.status = "overdue"
  } else if (daysUntil <= 7) {
    this.status = "alert"
  } else {
    this.status = "compliant"
  }

  next()
})

// Index for efficient queries
aircraftSchema.index({ registration: 1 })
aircraftSchema.index({ status: 1 })
aircraftSchema.index({ nextMaintenance: 1 })

module.exports = mongoose.model("Aircraft", aircraftSchema)
