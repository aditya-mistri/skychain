# git pull request 
# SkyChain


**A comprehensive blockchain-powered aircraft maintenance tracking system backend built with Node.js, Express, MongoDB, and Web3 integration.**

---------------------------------------------------------------------------------------

**Screenshot of UI part (Under development)**

![image](https://github.com/user-attachments/assets/26a63d96-6734-4628-a41b-9e041024e33d)




## Features

- **Aircraft Management**: Complete CRUD operations for aircraft registry
- **Parts Tracking**: Blockchain-verified parts authenticity and lifecycle management
- **Maintenance Management**: Work order system with digital signatures
- **Mechanic Dashboard**: Performance tracking and certification management
- **Blockchain Integration**: Web3-powered immutable record keeping
- **Analytics & ROI**: Comprehensive reporting and cost analysis
- **QR Code Generation**: Automated QR code creation for assets
- **Digital Signatures**: Cryptographic verification of maintenance work

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Blockchain**: Web3.js integration
- **Authentication**: JWT tokens
- **Validation**: Joi schema validation
- **QR Codes**: qrcode library
- **Cryptography**: Node.js crypto module

##Installation

**Clone the repository**
   ```
   git clone <repository-url>
   cd skychain-backend
   ```

**Install dependencies**
  ```
   npm install
   ```

**Set up environment variables**
  ```
   cp .env.example .env
   # Edit .env with your configuration
  ```

**Start MongoDB**
   ```
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
  ```

**Seed the database**
  ```
   npm run seed
  ```

**Start the server**
  ```
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```
   

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Aircraft Management
- `GET /aircraft` - Get all aircraft
- `GET /aircraft/:id` - Get single aircraft
- `POST /aircraft` - Create new aircraft
- `PUT /aircraft/:id` - Update aircraft
- `DELETE /aircraft/:id` - Delete aircraft
- `GET /aircraft/:id/maintenance-history` - Get maintenance history
- `GET /aircraft/:id/parts` - Get aircraft parts
- `POST /aircraft/:id/generate-qr` - Generate QR code

#### Parts Tracking
- `GET /parts` - Get all parts
- `GET /parts/:id` - Get single part
- `POST /parts` - Register new part
- `PUT /parts/:id` - Update part
- `POST /parts/:id/verify-authenticity` - Verify part authenticity
- `POST /parts/:id/add-inspection` - Add inspection record
- `GET /parts/statistics` - Get parts statistics
- `POST /parts/scan-qr` - Scan QR code

#### Maintenance Management
- `GET /maintenance` - Get all maintenance records
- `GET /maintenance/:id` - Get single maintenance record
- `POST /maintenance` - Create maintenance record
- `PUT /maintenance/:id` - Update maintenance record
- `POST /maintenance/:id/complete-task` - Complete checklist task
- `POST /maintenance/:id/digital-signature` - Add digital signature
- `GET /maintenance/statistics` - Get maintenance statistics
- `GET /maintenance/calendar/:year/:month` - Get calendar view

#### Mechanic Management
- `GET /mechanics` - Get all mechanics
- `GET /mechanics/:id` - Get single mechanic
- `POST /mechanics` - Create new mechanic
- `PUT /mechanics/:id` - Update mechanic
- `POST /mechanics/:id/update-performance` - Update performance metrics
- `GET /mechanics/:id/work-history` - Get work history
- `POST /mechanics/:id/add-certification` - Add certification
- `GET /mechanics/statistics` - Get mechanic statistics

#### Blockchain Operations
- `GET /blockchain/network-stats` - Get network statistics
- `GET /blockchain/transactions` - Get transaction history
- `GET /blockchain/transaction/:hash` - Get single transaction
- `POST /blockchain/execute-contract` - Execute smart contract
- `POST /blockchain/verify-signature` - Verify digital signature
- `GET /blockchain/entity-transactions/:entityType/:entityId` - Get entity transactions

#### Analytics & Reporting
- `GET /analytics/dashboard` - Get dashboard KPIs
- `GET /analytics/fleet-performance` - Get fleet performance metrics
- `GET /analytics/maintenance-trends` - Get maintenance trends
- `GET /analytics/mechanic-performance` - Get mechanic performance
- `GET /analytics/blockchain-metrics` - Get blockchain metrics
- `GET /analytics/roi-calculator` - Calculate ROI

## Database Schema

### Aircraft
```
{
  registration: String,      // Unique aircraft registration
  model: String,            // Aircraft model
  manufacturer: String,     // Manufacturer name
  yearBuilt: Number,        // Year of manufacture
  flightHours: Number,      // Total flight hours
  lastMaintenance: Date,    // Last maintenance date
  nextMaintenance: Date,    // Next maintenance due date
  status: String,           // compliant | alert | overdue | grounded
  location: String,         // Current location
  blockchainHash: String,   // Blockchain hash
  qrCode: String,          // QR code data
  parts: [ObjectId],       // Referenced parts
  maintenanceHistory: [ObjectId] // Referenced maintenance records
}
```

### Part
```
{
  partNumber: String,       // Part number
  name: String,            // Part name
  manufacturer: String,    // Manufacturer
  serialNumber: String,    // Unique serial number
  aircraft: ObjectId,      // Referenced aircraft
  installDate: Date,       // Installation date
  status: String,          // authentic | counterfeit | pending | retired
  location: String,        // Location on aircraft
  blockchainHash: String,  // Blockchain hash
  qrCode: String,         // QR code data
  nextInspection: Date,   // Next inspection date
  lifecycle: Object,      // Lifecycle tracking
  authenticity: Object    // Authenticity verification
}
```

### Maintenance
```
{
  workOrder: String,       // Unique work order number
  aircraft: ObjectId,      // Referenced aircraft
  type: String,           // Maintenance type
  description: String,    // Description
  priority: String,       // low | medium | high | critical
  status: String,         // pending | scheduled | in-progress | completed | cancelled | overdue
  assignedTo: ObjectId,   // Referenced mechanic
  scheduledDate: Date,    // Scheduled date
  dueDate: Date,         // Due date
  completedDate: Date,   // Completion date
  estimatedHours: Number, // Estimated hours
  actualHours: Number,   // Actual hours
  checklist: [Object],   // Task checklist
  compliance: Object,    // Compliance checks
  blockchainRecord: Object, // Blockchain transaction
  digitalSignature: Object  // Digital signature
}
```

### Mechanic
```
{
  employeeId: String,      // Unique employee ID
  name: String,           // Full name
  email: String,          // Email address
  password: String,       // Hashed password
  certifications: [Object], // Certifications
  specialties: [String],  // Areas of expertise
  rating: Number,         // Average rating
  tasksCompleted: Number, // Completed tasks count
  tasksInProgress: Number, // In-progress tasks count
  reputationScore: Number, // Reputation score
  blockchainSignatures: Number, // Blockchain signatures count
  performance: Object,    // Performance metrics
  walletAddress: String,  // Blockchain wallet address
  availability: Object    // Availability schedule
}
```

##Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Joi schema validation
- **Rate Limiting**: Express rate limiting
- **CORS Protection**: Configurable CORS settings
- **Helmet Security**: Security headers
- **Data Sanitization**: Input sanitization

##Testing

```
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

##Monitoring & Logging

The API includes comprehensive logging and monitoring:

- Request/response logging
- Error tracking
- Performance metrics
- Blockchain transaction monitoring
- Database query optimization

## Deployment

### Docker Deployment
```
# Build Docker image
docker build -t skychain-backend .

# Run container
docker run -p 5000:5000 --env-file .env skychain-backend
```



