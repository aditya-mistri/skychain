const mongoose = require("mongoose")

const maintenanceSchema = new mongoose.Schema(
  {
    workOrder: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    aircraft: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aircraft",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Scheduled Inspection",
        "Engine Service",
        "Avionics Check",
        "Landing Gear Service",
        "Hydraulic Service",
        "Emergency Repair",
        "Compliance Check",
        "Parts Replacement",
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "scheduled", "in-progress", "completed", "cancelled", "overdue"],
      default: "pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completedDate: Date,
    estimatedHours: {
      type: Number,
      required: true,
      min: 0,
    },
    actualHours: {
      type: Number,
      min: 0,
    },
    parts: [
      {
        part: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Part",
        },
        action: {
          type: String,
          enum: ["inspect", "replace", "repair", "calibrate"],
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    checklist: [
      {
        task: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Mechanic",
        },
        completedAt: Date,
        notes: String,
      },
    ],
    compliance: {
      faa: {
        required: Boolean,
        passed: Boolean,
        checkDate: Date,
        inspector: String,
      },
      easa: {
        required: Boolean,
        passed: Boolean,
        checkDate: Date,
        inspector: String,
      },
      manufacturer: {
        required: Boolean,
        passed: Boolean,
        checkDate: Date,
        reference: String,
      },
    },
    blockchainRecord: {
      transactionHash: String,
      blockNumber: Number,
      gasUsed: Number,
      timestamp: Date,
    },
    digitalSignature: {
      mechanic: String,
      supervisor: String,
      timestamp: Date,
      hash: String,
    },
    documentation: [
      {
        type: String,
        filename: String,
        url: String,
        uploadedAt: Date,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Mechanic",
        },
      },
    ],
    cost: {
      labor: Number,
      parts: Number,
      total: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for completion percentage
maintenanceSchema.virtual("completionPercentage").get(function () {
  if (!this.checklist || this.checklist.length === 0) return 0
  const completed = this.checklist.filter((item) => item.completed).length
  return Math.round((completed / this.checklist.length) * 100)
})

// Pre-save middleware to update status
maintenanceSchema.pre("save", function (next) {
  const now = new Date()

  if (this.status === "pending" && this.scheduledDate <= now) {
    this.status = "scheduled"
  }

  if (this.status !== "completed" && this.dueDate < now) {
    this.status = "overdue"
  }

  if (this.checklist && this.checklist.length > 0) {
    const allCompleted = this.checklist.every((item) => item.completed)
    if (allCompleted && this.status === "in-progress") {
      this.status = "completed"
      this.completedDate = now
    }
  }

  next()
})

// Index for efficient queries
maintenanceSchema.index({ workOrder: 1 })
maintenanceSchema.index({ aircraft: 1 })
maintenanceSchema.index({ status: 1 })
maintenanceSchema.index({ assignedTo: 1 })
maintenanceSchema.index({ dueDate: 1 })

module.exports = mongoose.model("Maintenance", maintenanceSchema)
