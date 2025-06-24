const express = require("express")
const router = express.Router()
const BlockchainTransaction = require("../models/BlockchainTransaction")
const {
  getNetworkStats,
  executeSmartContract,
  generateWalletAddress,
  validateTransaction,
} = require("../utils/blockchain")

// GET /api/blockchain/network-stats
router.get("/network-stats", async (req, res) => {
  try {
    const stats = getNetworkStats()

    // Add real database stats
    const totalTransactions = await BlockchainTransaction.countDocuments()
    const recentTransactions = await BlockchainTransaction.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .select("transactionHash type timestamp status")

    res.json({
      ...stats,
      totalTransactions,
      recentTransactions,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/blockchain/transactions
router.get("/transactions", async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query
    const query = {}

    if (type) query.type = type
    if (status) query.status = status

    const transactions = await BlockchainTransaction.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await BlockchainTransaction.countDocuments(query)

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/blockchain/transaction/:hash
router.get("/transaction/:hash", async (req, res) => {
  try {
    const transaction = await BlockchainTransaction.findOne({
      transactionHash: req.params.hash,
    })

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" })
    }

    res.json(transaction)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/blockchain/execute-contract
router.post("/execute-contract", async (req, res) => {
  try {
    const { contractAddress, method, params, entityType, entityId } = req.body

    if (!contractAddress || !method) {
      return res.status(400).json({ error: "Contract address and method are required" })
    }

    // Execute smart contract (simulated)
    const result = await executeSmartContract(contractAddress, method, params)

    // Save transaction record
    const transaction = new BlockchainTransaction({
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      blockHash: "0x" + require("crypto").randomBytes(32).toString("hex"),
      from: generateWalletAddress(),
      to: contractAddress,
      gasUsed: result.gasUsed,
      gasPrice: "20000000000", // 20 gwei
      status: "confirmed",
      type: "smart_contract_deployment",
      relatedEntity: {
        entityType: entityType || "Contract",
        entityId: entityId || require("mongoose").Types.ObjectId(),
      },
      data: {
        method,
        params,
        result,
      },
    })

    await transaction.save()

    res.json({
      success: true,
      transaction: result,
      record: transaction,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/blockchain/verify-signature
router.post("/verify-signature", async (req, res) => {
  try {
    const { signature, data, publicKey } = req.body

    if (!signature || !data) {
      return res.status(400).json({ error: "Signature and data are required" })
    }

    // Simulate signature verification
    const isValid = validateTransaction(signature)

    res.json({
      isValid,
      signature,
      timestamp: new Date(),
      verificationMethod: "blockchain",
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/blockchain/entity-transactions/:entityType/:entityId
router.get("/entity-transactions/:entityType/:entityId", async (req, res) => {
  try {
    const { entityType, entityId } = req.params

    const transactions = await BlockchainTransaction.find({
      "relatedEntity.entityType": entityType,
      "relatedEntity.entityId": entityId,
    }).sort({ timestamp: -1 })

    res.json(transactions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
