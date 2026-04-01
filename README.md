# 🏍️ Moto Parts API — Serverless Marketplace

A serverless REST API for listing and searching motorcycle parts, built with **Serverless Framework**, **AWS Lambda (local)**, and **DynamoDB Local**.

---

## 📁 Project Structure

```
moto-parts-api/
├── serverless.yml                  # Serverless Framework configuration
├── package.json
├── scripts/
│   └── seed.json                   # Sample data for local DynamoDB
└── src/
    ├── models/
    │   └── Part.js                 # Data model + validation
    ├── repositories/
    │   ├── dynamoClient.js         # DynamoDB client (local/cloud)
    │   └── partsRepository.js      # DynamoDB operations
    ├── business/
    │   └── partsService.js         # Business logic layer
    └── functions/
        ├── response.js             # HTTP response helpers
        ├── createPart.js           # POST /parts handler
        └── listParts.js            # GET /parts handler
```

---

## ⚙️ Prerequisites

Make sure you have installed:

- **Node.js** v18+ → https://nodejs.org/
- **Java JRE 8+** (required by DynamoDB Local) → https://www.java.com/
- **npm** v8+

---

## 🚀 Setup & Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Install DynamoDB Local

```bash
npm run dynamodb:install
```

This downloads the DynamoDB Local JAR file (requires Java).

### 3. Start the local server

```bash
npm start
```

This will:
- Start **DynamoDB Local** on port `8000`
- Create the `PartsTable` with the `TypeIndex` GSI
- Seed the table with sample motorcycle parts
- Start **serverless-offline** on port `3000`

You should see output like:
```
Server ready: http://localhost:3000
```

---

## 📡 API Endpoints

Base URL: `http://localhost:3000`

### POST /parts — Register a new part

```
POST http://localhost:3000/parts
Content-Type: application/json
```

**Request body:**
```json
{
  "name": "Front Brake Pad Set",
  "type": "brakes",
  "price": 45.99
}
```

**Success response (201):**
```json
{
  "message": "Part registered successfully.",
  "part": {
    "id": "uuid-auto-generated",
    "name": "Front Brake Pad Set",
    "type": "brakes",
    "price": 45.99,
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
}
```

**Validation error (400):**
```json
{
  "error": true,
  "message": "Field \"price\" must be greater than 0."
}
```

---

### GET /parts — List all parts

```
GET http://localhost:3000/parts
```

**Response (200):**
```json
{
  "count": 7,
  "parts": [ ... ]
}
```

---

### GET /parts?type=brakes — Filter by type

```
GET http://localhost:3000/parts?type=brakes
```

**Response (200):**
```json
{
  "count": 2,
  "filter": { "type": "brakes" },
  "parts": [
    {
      "id": "...",
      "name": "Front Brake Pad Set",
      "type": "brakes",
      "price": 45.99,
      "createdAt": "..."
    }
  ]
}
```

---

## 🧪 Testing with curl

```bash
# List all parts
curl http://localhost:3000/parts

# Filter by type
curl "http://localhost:3000/parts?type=brakes"
curl "http://localhost:3000/parts?type=engine"
curl "http://localhost:3000/parts?type=exhaust"

# Create a new part
curl -X POST http://localhost:3000/parts \
  -H "Content-Type: application/json" \
  -d '{"name": "Oil Filter", "type": "engine", "price": 9.99}'

# Validation error examples
curl -X POST http://localhost:3000/parts \
  -H "Content-Type: application/json" \
  -d '{"name": "Bad Part", "type": "engine", "price": -5}'
```

---

## 🔧 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start local server (DynamoDB + serverless-offline) |
| `npm run dynamodb:install` | Download DynamoDB Local JAR |
| `npm run deploy` | Deploy to AWS (requires AWS credentials) |

---

## 📦 Data Model

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string (UUID) | auto | Auto-generated UUID v4 |
| `name` | string | ✅ | Non-empty |
| `type` | string | ✅ | Indexed via GSI (TypeIndex), stored lowercase |
| `price` | number | ✅ | Must be > 0 |
| `createdAt` | string (ISO 8601) | auto | Auto-generated timestamp |

---

## 🏗️ Architecture

```
HTTP Request
    │
    ▼
serverless-offline (port 3000)
    │
    ▼
Lambda Function (createPart / listParts)
    │
    ▼
Business Logic Layer (partsService.js)
    │
    ▼
Repository Layer (partsRepository.js)
    │
    ▼
DynamoDB Local (port 8000)
```

### Layers

- **Functions** — Lambda handlers. Parse HTTP input and return HTTP responses.
- **Business Logic** — `partsService.js`. Validates data, orchestrates operations.
- **Repository** — `partsRepository.js`. All DynamoDB read/write operations.
- **Model** — `Part.js`. Data structure and field validation rules.

---

## 🌱 Seed Data

Pre-loaded sample parts:

| Name | Type | Price |
|---|---|---|
| Front Brake Pad Set | brakes | $45.99 |
| Rear Brake Disc | brakes | $89.50 |
| Air Filter K&N | engine | $32.00 |
| Spark Plug NGK Iridium | engine | $12.75 |
| Akrapovic Slip-On Exhaust | exhaust | $349.99 |
| Handlebar Grips | accessories | $18.00 |
| Chain & Sprocket Kit | transmission | $95.00 |

---

## 📝 Notes

- **No authentication** is required (as per spec).
- DynamoDB runs **in-memory** locally — data resets on restart (except seeded data).
- The `type` field is automatically converted to **lowercase** for consistent querying.
- Results are sorted by `createdAt` descending (newest first).
