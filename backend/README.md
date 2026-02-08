# BestUp Backend - Complete Setup & Documentation

> A smartphone decision engine API built with Node.js, Express, and MongoDB. Helps users find the best device based on their specific needs using AI-powered recommendations.

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Quick Start](#quick-start)
4. [Project Structure](#project-structure)
5. [Architecture Explained](#architecture-explained)
6. [Core Features](#core-features)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Configuration](#configuration)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**BestUp** is the backend for a smartphone comparison and recommendation platform. It uses sophisticated algorithms to:

- 🎮 **Gaming**: Score phones based on AnTuTu, refresh rate, touch sampling
- 📷 **Camera**: Evaluate based on megapixels, OIS, zoom, 4K capability
- 🎬 **Vlogging**: Prioritize stabilization, front 4K, and battery life
- 🔋 **Battery**: Assess capacity, charging speed, wireless charging
- 💰 **Value**: Calculate performance-to-price ratio

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express.js** | 5.x | Web framework |
| **MongoDB** | 5.x | NoSQL database |
| **Mongoose** | 9.x | ODM for MongoDB |
| **Async/Await** | ES2017 | Non-blocking I/O |
| **Colors** | Latest | Terminal coloring |
| **CORS** | Latest | Cross-origin requests |
| **Dotenv** | Latest | Environment variables |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

**Dependencies installed:**
- express (web framework)
- mongoose (database ODM)
- cors (cross-origin)
- dotenv (env vars)
- colors (terminal output)
- nodemon (development)

### Step 2: Configure Environment
Create `.env` file in `backend/` folder:
```bash
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bestup
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI with your connection string
```

### Step 4: Seed Sample Data
```bash
# Optional: Add sample phones to database
node backend/seed.js
```

**seed.js example:**
```javascript
const mongoose = require('mongoose');
require('dotenv').config();
const Phone = require('./models/Phone');
const samplePhones = require('./samplePhones');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Phone.deleteMany({});
    await Phone.insertMany(samplePhones);
    console.log('✓ Database seeded');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seed error:', error);
    process.exit(1);
  }
}
seed();
```

### Step 5: Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

### Output
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

✅ API is ready at `http://localhost:5000/api`

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection setup
│
├── models/
│   └── Phone.js                 # Mongoose schema + business logic
│                                # - calculateGamingScore()
│                                # - calculateCameraScore()
│                                # - getRecommendations()
│                                # - comparePhones()
│
├── controllers/
│   └── phoneController.js       # Request handlers
│                                # - getPhones() - List with filters
│                                # - recommendPhones() - Smart recommendations
│                                # - comparePhones() - Side-by-side comparison
│                                # - createPhone() - Add new phone
│
├── routes/
│   └── phoneRoutes.js           # API endpoint definitions
│                                # - GET /api/phones
│                                # - GET /api/phones/recommend
│                                # - GET /api/phones/compare
│                                # - GET /api/phones/:slug
│
├── middleware/
│   ├── errorMiddleware.js       # Global error handling
│   └── asyncHandler.js          # Async error wrapper
│
├── server.js                    # Express app initialization
├── .env                         # Environment variables (local)
├── .env.example                 # Environment template
├── package.json                 # Dependencies
├── samplePhones.js              # Test data
└── seed.js                      # Database seeding script
```

---

## 🏗️ Architecture Explained

### MVC Pattern (Model-View-Controller)

```
Request → Routes → Controller → Model → Database
  ↓        ↓         ↓           ↓         ↓
User   Define      Process    Query    MongoDB
Input  Endpoint    Logic      Data     Response
       
Response → Format JSON → Send to Client
```

### Request/Response Flow

#### Example: Get Gaming Phone Recommendations

```javascript
// 1. USER REQUEST
GET /api/phones/recommend?budget=25000&priority=Gaming

// 2. ROUTE HANDLER (phoneRoutes.js)
router.get('/recommend', recommendPhones);

// 3. CONTROLLER (phoneController.js)
const recommendPhones = asyncHandler(async (req, res) => {
  const { budget, priority } = req.query;
  
  // Validate input
  if (!budget || isNaN(budget)) {
    res.status(400);
    throw new Error('Valid budget required');
  }
  
  // Call Model method
  const recommendations = await Phone.getRecommendations({
    budget, priority, limit: 5
  });
  
  // Return JSON response
  res.json({
    success: true,
    count: recommendations.length,
    data: recommendations
  });
});

// 4. MODEL (Phone.js)
phoneSchema.statics.getRecommendations = async function({ budget, priority }) {
  return this.aggregate([
    { $match: { 'variants.price': { $lte: budget } } },
    { $sort: { [sortField]: -1 } },
    { $limit: 5 }
  ]);
};

// 5. DATABASE
MongoDB returns top 5 phones sorted by gaming score

// 6. RESPONSE TO CLIENT
{
  "success": true,
  "count": 5,
  "data": [
    { "name": "OnePlus 13", "scores": { "gaming": 8.9 } },
    ...
  ]
}
```

### Data Flow

```
CLIENT                BACKEND              DATABASE
  │                      │                    │
  ├─ GET /recommend ────→ │                    │
  │                      ├─ Query MongoDB ───→ │
  │                      │                    ├─ Find phones
  │                      │                    └─ Sort by score
  │                      │ ←─ Return docs ────┤
  │                      ├─ Calculate scores
  │                      ├─ Format response
  │ ←─ JSON response ────┤
  │                      │
```

---

## ⭐ Core Features

### 1. Smart Recommendation Engine

**How it works:**
1. User provides budget + priority (Gaming/Camera/Battery/Value)
2. Backend queries phones within budget
3. Applies weighted scoring formula based on priority
4. Returns top 5 phones ranked by score

**Example Query:**
```bash
GET /api/phones/recommend?budget=25000&priority=Gaming
```

**Gaming Score Formula:**
```
Score = (
  (AnTuTu/2.5M) * 0.40 +        # 40% Performance
  (RefreshRate/144) * 0.30 +    # 30% Display
  (TouchSampling/720) * 0.20 +  # 20% Responsiveness
  (Cooling System ? 0.10 : 0)   # 10% Cooling
) * 10
```

### 2. Advanced Filtering

**Supported Filters:**
- `price[lte]` - Maximum price
- `price[gte]` - Minimum price
- `brand` - Filter by brand
- `ram[gte]` - Minimum RAM
- `antutu[gte]` - Minimum AnTuTu score
- `search` - Full-text search

**Example:**
```bash
GET /api/phones?brand=Samsung&price[lte]=50000&ram[gte]=8&sort=-scores.gaming
```

### 3. Dynamic Comparison

Compare 2-5 phones side-by-side with automatic winner detection.

**Example:**
```bash
GET /api/phones/compare?ids=iphone-16-pro,onePlus-13,pixel-9-pro
```

**Response includes:**
- Side-by-side specs
- Winners in each category (Gaming, Camera, Battery, Value)
- Price comparison
- Recommendation summary

### 4. Pagination & Search

**Pagination:**
```bash
GET /api/phones?limit=10&skip=20  # Get items 21-30
```

**Full-Text Search:**
```bash
GET /api/phones?search=gaming+camera  # Text index search
```

### 5. Pre-calculated Scores

Automatic scoring on phone creation:
- **Gaming Score** (0-10): Based on performance metrics
- **Camera Score** (0-10): Based on sensor quality
- **Battery Score** (0-10): Based on capacity + charging
- **Value Score** (0-10): Performance-to-price ratio

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Endpoints Overview

```
GET    /phones                    # List all phones
GET    /phones?brand=Samsung      # Filter by brand
GET    /phones/recommend          # Smart recommendations ⭐
GET    /phones/compare            # Compare phones
GET    /phones/:slug              # Get single phone
POST   /phones                    # Create phone (Admin)
PUT    /phones/:slug              # Update phone (Admin)
DELETE /phones/:slug              # Delete phone (Admin)
```

### Key Endpoints Explained

#### 1. Get Recommendations (MOST IMPORTANT)
```bash
GET /api/phones/recommend?budget=25000&priority=Gaming&limit=5
```

**Parameters:**
- `budget` (required): Max price in rupees
- `priority`: Gaming | Camera | Vlogging | Battery | Value
- `limit`: 1-10 (default: 5)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "budget": 25000,
  "priority": "Gaming",
  "data": [
    {
      "name": "OnePlus 13",
      "recommendationReason": "Best for gaming with AnTuTu score...",
      "bestFor": "Gaming",
      "scores": { "gaming": 8.9, "camera": 7.2, ... }
    }
  ]
}
```

#### 2. List Phones with Filters
```bash
GET /api/phones?brand=Samsung&price[lte]=50000&sort=-scores.gaming&limit=10
```

**Query String Filters:**
- `brand`: Brand name
- `price[lte]`: Max price
- `price[gte]`: Min price
- `ram[gte]`: Minimum RAM
- `search`: Full-text search
- `sort`: Sort field (prefix `-` for descending)
- `limit`: Results per page
- `skip`: Skip N results (pagination)

#### 3. Compare Phones
```bash
GET /api/phones/compare?ids=onePlus-13,iphone-16-pro,pixel-9-pro
```

**Response:**
```json
{
  "comparisonCount": 3,
  "winner": {
    "gaming": { "name": "OnePlus 13", "score": 8.9 },
    "camera": { "name": "iPhone 16 Pro", "score": 9.1 },
    "battery": { "name": "Samsung S24", "score": 8.5 },
    "valueForMoney": { "name": "OnePlus 13", "score": 8.7 }
  },
  "phones": [ ... ]
}
```

#### 4. Get Single Phone
```bash
GET /api/phones/iphone-16-pro
```

**Returns complete phone with all specs, scores, and variants.**

### Error Handling

All errors return JSON:

```json
{
  "success": false,
  "error": "Error message describing the issue",
  "statusCode": 400
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad request
- `404` - Not found
- `409` - Conflict (duplicate)
- `422` - Validation error
- `500` - Server error

---

## 💾 Database Schema

### Phone Collection

```javascript
{
  _id: ObjectId,
  
  // Basic Info
  name: "OnePlus 13",
  brand: "OnePlus",
  slug: "onepluse-13",  // Unique URL-friendly ID
  basePrice: 45999,
  
  // Specifications (Deep Nesting)
  specs: {
    performance: {
      processor: "Snapdragon 8 Gen 3",
      antutuScore: 2100000,
      ramOptions: [8, 12, 16],
      coolingSystem: "VC Cooling"
    },
    display: {
      size: 6.82,
      refreshRate: 120,
      touchSamplingRate: 720,
      brightness: 1500
    },
    camera: {
      rear: {
        main: { megapixels: 50, aperture: "f/1.6", ois: true },
        ultraWide: { megapixels: 48 },
        telephoto: { megapixels: 50 }
      },
      front: { megapixels: 32, videoCapable4K: true }
    },
    battery: {
      capacity: 6000,
      chargingSpeed: 100,
      wirelessCharging: false
    }
  },
  
  // Variants (Different RAM/Storage/Price combos)
  variants: [
    {
      ram: 12,
      storage: 256,
      color: "Black",
      price: 45999,
      sku: "OP13-12-256-BLK",
      stock: 50
    }
  ],
  
  // Pre-calculated Scores
  scores: {
    gaming: 8.9,
    camera: 7.8,
    battery: 8.2,
    valueForMoney: 8.5
  },
  
  // Metadata
  overview: "Flagship killer...",
  pros: ["Amazing performance", ...],
  cons: ["No wireless charging", ...],
  releaseDate: ISODate,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### Indexes for Performance

```javascript
// Indexed fields for fast queries
db.phones.createIndex({ brand: 1 });
db.phones.createIndex({ basePrice: 1 });
db.phones.createIndex({ "scores.gaming": -1 });
db.phones.createIndex({ "scores.camera": -1 });
db.phones.createIndex({ "scores.valueForMoney": -1 });
db.phones.createIndex({ name: "text", brand: "text" });  // Full-text search
```

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/bestup
# OR MongoDB Atlas:
# MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/bestup

# Security
JWT_SECRET=your_secret_key_change_in_production
CORS_ORIGIN=http://localhost:3000

# Admin
ADMIN_EMAIL=admin@bestup.com
```

### MongoDB Connection Options

**Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/bestup
```

**MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/bestup?retryWrites=true&w=majority
```

**Connection Pool Options (in code):**
```javascript
mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000
});
```

---

## 🧪 Testing

### Manual Testing with CURL

#### Test 1: Get All Phones
```bash
curl http://localhost:5000/api/phones
```

#### Test 2: Get Gaming Recommendations
```bash
curl "http://localhost:5000/api/phones/recommend?budget=25000&priority=Gaming"
```

#### Test 3: Filter Phones
```bash
curl "http://localhost:5000/api/phones?brand=Samsung&price[lte]=50000&limit=5"
```

#### Test 4: Compare Phones
```bash
curl "http://localhost:5000/api/phones/compare?ids=iphone-16-pro,onePlus-13"
```

#### Test 5: Get Single Phone
```bash
curl http://localhost:5000/api/phones/iphone-16-pro
```

### Testing with Postman

1. Import base URL: `http://localhost:5000/api`
2. Create requests:
   - **GET** `/phones` - List phones
   - **GET** `/phones/recommend?budget=25000&priority=Gaming` - Get recommendations
   - **GET** `/phones/compare?ids=id1,id2` - Compare
   - **POST** `/phones` - Create phone (with JSON body)

### Unit Testing (Future)

```javascript
// Example test structure
describe('Phone API', () => {
  test('Should get gaming recommendations under ₹25k', async () => {
    const res = await request(app)
      .get('/api/phones/recommend')
      .query({ budget: 25000, priority: 'Gaming' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });
});
```

---

## 🚀 Deployment

### Deploy to Render (Easy)

1. Push code to GitHub
2. Connect Render to your repository
3. Set environment variables in Render dashboard
4. Deploy (automatically uses `npm start`)

### Deploy to Railway

```bash
# Push to Git
git push origin main

# Railway auto-detects Node.js project
# Set MONGO_URI in environment
```

### Deploy to AWS/Azure

Create `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Failed

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Ensure MongoDB is running: `mongod`
2. Check `MONGO_URI` in `.env`
3. If using MongoDB Atlas, verify connection string

### Issue: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### Issue: "Cannot find module 'mongoose'"

**Solution:**
```bash
npm install
```

### Issue: CORS Error

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
Update `.env`:
```env
CORS_ORIGIN=http://localhost:3000
```

### Issue: Slow Queries

**Solution:**
1. Check indexes: `db.phones.getIndexes()`
2. Add missing indexes: `db.phones.createIndex({ brand: 1 })`
3. Use `.explain()` to analyze query: `db.phones.find({brand: "Samsung"}).explain("executionStats")`

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [MongoDB Aggregation](https://docs.mongodb.com/manual/aggregation/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 📖 Detailed Documentation Files

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete architecture explanation with diagrams
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Detailed API endpoint reference
- **[samplePhones.js](./samplePhones.js)** - Sample data for testing

---

## 🎓 Learning Path

1. **Understand MVC Pattern** → Read ARCHITECTURE.md
2. **Explore API Endpoints** → Read API_DOCUMENTATION.md
3. **Set up locally** → Follow Quick Start section
4. **Test endpoints** → Use CURL or Postman
5. **Study code** → Review controllers and models
6. **Modify & Experiment** → Add your own features

---

## 📝 Version History

- **v1.0** (Feb 2026)
  - Core API structure
  - Smart recommendations engine
  - Advanced filtering & search
  - Phone comparison feature
  - Global error handling

---

## ✨ Future Enhancements

- [ ] JWT Authentication & Admin panel
- [ ] User preferences & saved comparisons
- [ ] Real-time price tracking
- [ ] User reviews & ratings
- [ ] GraphQL API
- [ ] WebSocket for live updates
- [ ] Redis caching
- [ ] API rate limiting

---

**Created by:** Sujeet Sharma  
**Project:** BestUp  
**Version:** 1.0  
**Last Updated:** February 2026

---

Ready to compare smartphones? 🚀

Start the server and explore the API at `http://localhost:5000/api`
