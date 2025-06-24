const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const mechanicSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    certifications: [
      {
        name: {
          type: String,
          required: true,
        },
        number: String,
        issuedBy: String,
        issuedDate: Date,
        expiryDate: Date,
        status: {
          type: String,
          enum: ["active", "expired", "suspended"],
          default: "active",
        },
      },
    ],
    specialties: [
      {
        type: String,
        trim: true,
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    tasksInProgress: {
      type: Number,
      default: 0,
    },
    reputationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 1000,
    },
    blockchainSignatures: {
      type: Number,
      default: 0,
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
    },
    privateKey: {
      type: String,
      select: false, // Don't include in queries by default
    },
    performance: {
      qualityScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      onTimeCompletion: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      complianceRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      averageTaskTime: Number,
      customerSatisfaction: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
    },
    workHistory: [
      {
        maintenance: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Maintenance",
        },
        completedAt: Date,
        rating: Number,
        feedback: String,
      },
    ],
    availability: {
      status: {
        type: String,
        enum: ["available", "busy", "off-duty", "vacation"],
        default: "available",
      },
      schedule: [
        {
          day: {
            type: String,
            enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
          },
          startTime: String,
          endTime: String,
          available: Boolean,
        },
      ],
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.password
        delete ret.privateKey
        return ret
      },
    },
    toObject: { virtuals: true },
  },
)

// Hash password before saving
mechanicSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
mechanicSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Update last active timestamp
mechanicSchema.methods.updateLastActive = function () {
  this.lastActive = new Date()
  return this.save()
}

// Calculate overall performance score
mechanicSchema.virtual("overallPerformance").get(function () {
  const { qualityScore, onTimeCompletion, complianceRate } = this.performance
  return Math.round((qualityScore + onTimeCompletion + complianceRate) / 3)
})

// Index for efficient queries
mechanicSchema.index({ employeeId: 1 })
mechanicSchema.index({ email: 1 })
mechanicSchema.index({ walletAddress: 1 })
mechanicSchema.index({ "availability.status": 1 })

module.exports = mongoose.model("Mechanic", mechanicSchema)
