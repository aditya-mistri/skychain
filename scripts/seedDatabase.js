const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Aircraft = require("../models/Aircraft")
const Part = require("../models/Part")
const Maintenance = require("../models/Maintenance")
const Mechanic = require("../models/Mechanic")
const BlockchainTransaction = require("../models/BlockchainTransaction")
const { generateBlockchainHash, generateQRCode } = require("../utils/blockchain")

dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/skychain", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...")

    // Clear existing data
    await Aircraft.deleteMany({})
    await Part.deleteMany({})
    await Maintenance.deleteMany({})
    await Mechanic.deleteMany({})
    await BlockchainTransaction.deleteMany({})

    console.log("🗑️  Cleared existing data")

    // Seed Mechanics
    const mechanics = await Mechanic.create([
      {
        employeeId: "EMP001",
        name: "John Smith",
        email: "john.smith@skychain.com",
        password: "password123",
        certifications: [
          {
            name: "A&P License",
            number: "AP123456",
            issuedBy: "FAA",
            issuedDate: new Date("2018-01-15"),
            expiryDate: new Date("2026-01-15"),
            status: "active",
          },
          {
            name: "Boeing 737 Type",
            number: "B737-001",
            issuedBy: "Boeing",
            issuedDate: new Date("2019-03-20"),
            expiryDate: new Date("2025-03-20"),
            status: "active",
          },
        ],
        specialties: ["Engine Maintenance", "Avionics", "Structural Repair"],
        rating: 4.8,
        tasksCompleted: 247,
        tasksInProgress: 3,
        reputationScore: 950,
        blockchainSignatures: 247,
        performance: {
          qualityScore: 96,
          onTimeCompletion: 94,
          complianceRate: 100,
        },
      },
      {
        employeeId: "EMP002",
        name: "Sarah Johnson",
        email: "sarah.johnson@skychain.com",
        password: "password123",
        certifications: [
          {
            name: "A&P License",
            number: "AP789012",
            issuedBy: "FAA",
            issuedDate: new Date("2017-06-10"),
            expiryDate: new Date("2025-06-10"),
            status: "active",
          },
          {
            name: "Airbus A320 Type",
            number: "A320-002",
            issuedBy: "Airbus",
            issuedDate: new Date("2018-09-15"),
            expiryDate: new Date("2024-09-15"),
            status: "active",
          },
        ],
        specialties: ["Hydraulic Systems", "Landing Gear", "Composite Materials"],
        rating: 4.9,
        tasksCompleted: 189,
        tasksInProgress: 2,
        reputationScore: 1020,
        blockchainSignatures: 189,
        performance: {
          qualityScore: 98,
          onTimeCompletion: 96,
          complianceRate: 100,
        },
      },
      {
        employeeId: "EMP003",
        name: "Mike Wilson",
        email: "mike.wilson@skychain.com",
        password: "password123",
        certifications: [
          {
            name: "A&P License",
            number: "AP345678",
            issuedBy: "FAA",
            issuedDate: new Date("2020-02-28"),
            expiryDate: new Date("2028-02-28"),
            status: "active",
          },
        ],
        specialties: ["Non-Destructive Testing", "Electrical Systems", "Fuel Systems"],
        rating: 4.7,
        tasksCompleted: 156,
        tasksInProgress: 1,
        reputationScore: 875,
        blockchainSignatures: 156,
        performance: {
          qualityScore: 92,
          onTimeCompletion: 88,
          complianceRate: 98,
        },
      },
    ])

    console.log("👨‍🔧 Created mechanics")

    // Seed Aircraft
    const aircraft = await Aircraft.create([
      {
        registration: "N737BA",
        model: "Boeing 737-800",
        manufacturer: "Boeing",
        yearBuilt: 2018,
        flightHours: 12450,
        lastMaintenance: new Date("2024-01-15"),
        nextMaintenance: new Date("2024-02-15"),
        status: "compliant",
        location: "LAX",
        blockchainHash: generateBlockchainHash("N737BA-Boeing-737-800"),
        qrCode: await generateQRCode({ type: "aircraft", registration: "N737BA" }),
      },
      {
        registration: "N320AC",
        model: "Airbus A320",
        manufacturer: "Airbus",
        yearBuilt: 2020,
        flightHours: 8750,
        lastMaintenance: new Date("2024-01-20"),
        nextMaintenance: new Date("2024-01-25"),
        status: "alert",
        location: "JFK",
        blockchainHash: generateBlockchainHash("N320AC-Airbus-A320"),
        qrCode: await generateQRCode({ type: "aircraft", registration: "N320AC" }),
      },
      {
        registration: "N190ER",
        model: "Embraer 190",
        manufacturer: "Embraer",
        yearBuilt: 2019,
        flightHours: 9200,
        lastMaintenance: new Date("2024-01-10"),
        nextMaintenance: new Date("2024-03-10"),
        status: "overdue",
        location: "ORD",
        blockchainHash: generateBlockchainHash("N190ER-Embraer-190"),
        qrCode: await generateQRCode({ type: "aircraft", registration: "N190ER" }),
      },
    ])

    console.log("✈️  Created aircraft")

    // Seed Parts
    const parts = await Part.create([
      {
        partNumber: "CFM56-7B24",
        name: "Engine Turbine Blade",
        manufacturer: "CFM International",
        serialNumber: "TB-2024-001",
        aircraft: aircraft[0]._id,
        installDate: new Date("2024-01-15"),
        status: "authentic",
        location: "Engine Bay 1",
        blockchainHash: generateBlockchainHash("CFM56-7B24-TB-2024-001"),
        qrCode: await generateQRCode({ type: "part", partNumber: "CFM56-7B24" }),
        nextInspection: new Date("2024-07-15"),
        lifecycle: {
          manufactured: {
            date: new Date("2023-12-01"),
            facility: "CFM International - Ohio",
            batchNumber: "BATCH-2023-456",
          },
        },
      },
      {
        partNumber: "A320-LG-001",
        name: "Landing Gear Assembly",
        manufacturer: "Safran Landing Systems",
        serialNumber: "LG-2023-456",
        aircraft: aircraft[1]._id,
        installDate: new Date("2023-12-10"),
        status: "counterfeit",
        location: "Main Landing Gear",
        blockchainHash: generateBlockchainHash("A320-LG-001-LG-2023-456"),
        qrCode: await generateQRCode({ type: "part", partNumber: "A320-LG-001" }),
        nextInspection: new Date("2024-06-10"),
      },
      {
        partNumber: "E190-AV-789",
        name: "Avionics Control Unit",
        manufacturer: "Honeywell",
        serialNumber: "AV-2024-789",
        aircraft: aircraft[2]._id,
        installDate: new Date("2024-01-20"),
        status: "authentic",
        location: "Cockpit Panel",
        blockchainHash: generateBlockchainHash("E190-AV-789-AV-2024-789"),
        qrCode: await generateQRCode({ type: "part", partNumber: "E190-AV-789" }),
        nextInspection: new Date("2024-12-20"),
      },
    ])

    console.log("🔧 Created parts")

    // Seed Maintenance Records
    const maintenance = await Maintenance.create([
      {
        workOrder: "WO-2024-001",
        aircraft: aircraft[0]._id,
        type: "Scheduled Inspection",
        description: "100-hour inspection required",
        priority: "high",
        status: "pending",
        assignedTo: mechanics[0]._id,
        scheduledDate: new Date("2024-02-10"),
        dueDate: new Date("2024-02-15"),
        estimatedHours: 8,
        checklist: [
          { task: "Visual inspection of components", completed: false },
          { task: "Check fluid levels", completed: false },
          { task: "Test system functionality", completed: false },
          { task: "Replace worn parts", completed: false },
          { task: "Final inspection and sign-off", completed: false },
        ],
      },
      {
        workOrder: "WO-2024-002",
        aircraft: aircraft[1]._id,
        type: "Engine Service",
        description: "Engine oil change and filter replacement",
        priority: "critical",
        status: "overdue",
        assignedTo: mechanics[1]._id,
        scheduledDate: new Date("2024-01-20"),
        dueDate: new Date("2024-01-25"),
        estimatedHours: 4,
        checklist: [
          { task: "Drain old oil", completed: true },
          { task: "Replace oil filter", completed: true },
          { task: "Add new oil", completed: false },
          { task: "Test engine operation", completed: false },
        ],
      },
    ])

    console.log("🔨 Created maintenance records")

    // Update aircraft with parts and maintenance references
    aircraft[0].parts = [parts[0]._id]
    aircraft[0].maintenanceHistory = [maintenance[0]._id]
    await aircraft[0].save()

    aircraft[1].parts = [parts[1]._id]
    aircraft[1].maintenanceHistory = [maintenance[1]._id]
    await aircraft[1].save()

    aircraft[2].parts = [parts[2]._id]
    await aircraft[2].save()

    // Seed Blockchain Transactions
    await BlockchainTransaction.create([
      {
        transactionHash: generateBlockchainHash("aircraft-registration-N737BA"),
        blockNumber: 2847392,
        blockHash: generateBlockchainHash("block-2847392"),
        from: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
        to: "0x8ba1f109551bD432803012645Hac136c",
        gasUsed: 21000,
        gasPrice: "20000000000",
        status: "confirmed",
        type: "aircraft_registration",
        relatedEntity: {
          entityType: "Aircraft",
          entityId: aircraft[0]._id,
        },
        data: {
          registration: "N737BA",
          model: "Boeing 737-800",
          action: "register",
        },
      },
      {
        transactionHash: generateBlockchainHash("part-authentication-CFM56"),
        blockNumber: 2847393,
        blockHash: generateBlockchainHash("block-2847393"),
        from: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
        to: "0x9cb2f210662cE543904023756Ibd247d",
        gasUsed: 45000,
        gasPrice: "21000000000",
        status: "confirmed",
        type: "part_authentication",
        relatedEntity: {
          entityType: "Part",
          entityId: parts[0]._id,
        },
        data: {
          partNumber: "CFM56-7B24",
          serialNumber: "TB-2024-001",
          action: "authenticate",
        },
      },
    ])

    console.log("⛓️  Created blockchain transactions")

    console.log("✅ Database seeding completed successfully!")
    console.log(`📊 Created:
    - ${mechanics.length} mechanics
    - ${aircraft.length} aircraft
    - ${parts.length} parts
    - ${maintenance.length} maintenance records
    - 2 blockchain transactions`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    mongoose.connection.close()
  }
}

// Run the seeding function
seedDatabase()
