const mongoose = require("mongoose")

const partSchema = new mongoose.Schema(
  {
    partNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
    serialNumber: {
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
    installDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["authentic", "counterfeit", "pending", "retired"],
      default: "pending",
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
    nextInspection: {
      type: Date,
      required: true,
    },
    lifecycle: {
      manufactured: {
        date: Date,
        facility: String,
        batchNumber: String,
      },
      certified: {
        date: Date,
        authority: String,
        certificateNumber: String,
      },
      installed: {
        date: Date,
        mechanic: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Mechanic",
        },
      },
      inspections: [
        {
          date: Date,
          type: String,
          result: String,
          mechanic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mechanic",
          },
        },
      ],
    },
    specifications: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      material: String,
      operatingLimits: {
        temperature: {
          min: Number,
          max: Number,
        },
        pressure: {
          min: Number,
          max: Number,
        },
      },
    },
    authenticity: {
      verified: {
        type: Boolean,
        default: false,
      },
      verificationDate: Date,
      verificationMethod: String,
      blockchainProof: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for days until next inspection
partSchema.virtual("daysUntilInspection").get(function () {
  const now = new Date()
  const nextInspection = new Date(this.nextInspection)
  const diffTime = nextInspection - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Index for efficient queries
partSchema.index({ partNumber: 1 })
partSchema.index({ serialNumber: 1 })
partSchema.index({ status: 1 })
partSchema.index({ aircraft: 1 })

module.exports = mongoose.model("Part", partSchema)
