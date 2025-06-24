const mongoose = require("mongoose")

const blockchainTransactionSchema = new mongoose.Schema(
  {
    transactionHash: {
      type: String,
      required: true,
      unique: true,
    },
    blockNumber: {
      type: Number,
      required: true,
    },
    blockHash: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    gasUsed: {
      type: Number,
      required: true,
    },
    gasPrice: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: "0",
    },
    contractAddress: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
    type: {
      type: String,
      enum: [
        "aircraft_registration",
        "part_authentication",
        "maintenance_record",
        "mechanic_signature",
        "compliance_check",
        "smart_contract_deployment",
      ],
      required: true,
    },
    relatedEntity: {
      entityType: {
        type: String,
        enum: ["Aircraft", "Part", "Maintenance", "Mechanic"],
        required: true,
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    confirmations: {
      type: Number,
      default: 0,
    },
    networkFee: {
      type: String,
      default: "0",
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
blockchainTransactionSchema.index({ transactionHash: 1 })
blockchainTransactionSchema.index({ type: 1 })
blockchainTransactionSchema.index({ "relatedEntity.entityType": 1, "relatedEntity.entityId": 1 })
blockchainTransactionSchema.index({ timestamp: -1 })

module.exports = mongoose.model("BlockchainTransaction", blockchainTransactionSchema)
