# 🏍️ Motorcycle Parts API

A fully local serverless REST API for registering and querying motorcycle parts, built with the **Serverless Framework**, **AWS Lambda (simulated)**, and **DynamoDB (local)**.

---

## Architecture

```
HTTP Request
    │
    ▼
API Gateway (serverless-offline)
    │
    ▼
Lambda Handler       ← parse request, validate input, return response
    │
    ▼
Service Layer        ← business logic, validation rules
    │
    ▼
Repository Layer     ← DynamoDB operations only
    │
    ▼
DynamoDB Local       ← Parts table + type-index GSI
```

---

## Project Structure

```
motorcycle-parts-api/
├── serverless.yml               # Serverless Framework config
├── tsconfig.json
├── package.json
├── scripts/
│   └── setup-db.js              # Manual DynamoDB table setup (optional)
└── src/
    ├── models/
    │   └── Part.ts              # Types & interfaces
    ├── repositories/
    │   ├── dynamoClient.ts      # DynamoDB client config
    │   └── partsRepository.ts   # DynamoDB read/write operations
    ├── services/
    │   └── partsService.ts      # Business logic & validation
    └── handlers/
        ├── response.ts          # HTTP response helpers
        ├── createPart.ts        # POST /parts handler
        └── getPartsByType.ts    # GET /parts handler
```

---

## Prerequisites

- **Node.js 18.x**
- **Java Runtime (JRE 8+)** — required by DynamoDB Local
- **npm** or **yarn**

---

## Setup & Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Install DynamoDB Local binary

```bash
npx serverless dynamodb install
```

### 3. Start the server

```bash
npm start
# or
npx serverless offline start
```

This will:
- Launch **DynamoDB Local** on port `8000`
- Auto-create the `Parts` table with the `type-index` GSI (via `migrate: true`)
- Launch **API Gateway simulation** on port `3000`

---

## API Reference

Base URL: `http://localhost:3000`

---

### POST /parts — Register a Part

**Request:**
```bash
curl -X POST http://localhost:3000/parts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Brake Disc",
    "type": "brakes",
    "price": 49.99
  }'
```

**Response 201:**
```json
{
  "id": "a3f1c2d4-...",
  "name": "Brake Disc",
  "type": "brakes",
  "price": 49.99,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Response 400 (validation error):**
```json
{
  "error": "Bad Request",
  "details": [
    { "field": "price", "message": "\"price\" must be a number greater than 0" }
  ]
}
```

#### Validation Rules
| Field   | Rule                              |
|---------|-----------------------------------|
| `name`  | Required, non-empty string        |
| `type`  | Required, non-empty string        |
| `price` | Required, number strictly > 0     |

---

### GET /parts?type={type} — Query Parts by Type

**Request:**
```bash
curl "http://localhost:3000/parts?type=brakes"
```

**Response 200:**
```json
[
  {
    "id": "a3f1c2d4-...",
    "name": "Brake Disc",
    "type": "brakes",
    "price": 49.99,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Response 400 (missing type):**
```json
{
  "error": "Bad Request",
  "details": [
    { "field": "type", "message": "Query parameter \"type\" is required" }
  ]
}
```

---

## Example curl Test Sequence

```bash
# 1. Register a brake disc
curl -s -X POST http://localhost:3000/parts \
  -H "Content-Type: application/json" \
  -d '{"name":"Brake Disc","type":"brakes","price":49.99}' | jq

# 2. Register brake pads
curl -s -X POST http://localhost:3000/parts \
  -H "Content-Type: application/json" \
  -d '{"name":"Brake Pads","type":"brakes","price":29.99}' | jq

# 3. Register an engine filter
curl -s -X POST http://localhost:3000/parts \
  -H "Content-Type: application/json" \
  -d '{"name":"Air Filter","type":"engine","price":19.50}' | jq

# 4. Query all brake parts
curl -s "http://localhost:3000/parts?type=brakes" | jq

# 5. Query engine parts
curl -s "http://localhost:3000/parts?type=engine" | jq

# 6. Test validation — missing name
curl -s -X POST http://localhost:3000/parts \
  -H "Content-Type: application/json" \
  -d '{"type":"brakes","price":10}' | jq

# 7. Test validation — price = 0
curl -s -X POST http://localhost:3000/parts \
  -H "Content-Type: application/json" \
  -d '{"name":"X","type":"brakes","price":0}' | jq
```

---

## Data Model

### Part Entity

| Field       | Type     | Description                        |
|-------------|----------|------------------------------------|
| `id`        | `string` | UUID (auto-generated)              |
| `name`      | `string` | Part name (required)               |
| `type`      | `string` | Part category (required, indexed)  |
| `price`     | `number` | Price in USD, must be > 0          |
| `createdAt` | `string` | ISO 8601 timestamp                 |

### DynamoDB Table: `Parts`

| Key Type | Attribute | Type   |
|----------|-----------|--------|
| PK       | `id`      | String |

**GSI: `type-index`**

| Key Type | Attribute | Type   |
|----------|-----------|--------|
| PK       | `type`    | String |

---

## Deploying to Real AWS

When ready to deploy to AWS, remove the local overrides from `serverless.yml`:

```yaml
# Remove these from provider.environment:
DYNAMODB_ENDPOINT: http://localhost:8000
AWS_ACCESS_KEY_ID: local
AWS_SECRET_ACCESS_KEY: local

# Remove from custom:
dynamodb:
  start:
    ...
```

Then run:
```bash
npx serverless deploy --stage prod
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `DynamoDB Local not starting` | Ensure Java (JRE 8+) is installed: `java -version` |
| `Table not found` | Run `node scripts/setup-db.js` or restart with `npm start` |
| `Port 3000 in use` | Change `httpPort` in `serverless.yml` |
| `Port 8000 in use` | Change `port` under `dynamodb.start` in `serverless.yml` |
