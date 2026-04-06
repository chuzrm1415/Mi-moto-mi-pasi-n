# First prompt to enhance the coding IA prompt

I have a software desing project and i need you to improve the description to be a little more comprenssive for a coding IA. This is the project description:

Serverless API for a motorcycle parts marketplace. Build a system where users can list motorcycle parts and others can search for them by type or category, using decoupled functions and simulating a local serverless environment. Exercise in pairs.

- Architecture: Serverless with Lambda functions + REST

- Database: Local DynamoDB

- Layers: Business logic, repositories, model

- Uses local AWS SDK and plugins like serverless-offline

- Write operation: POST /parts to register a part with name, type, and price

- Read operation: GET /parts?type=x to list parts by type

- Data model: Part: id: string (UUID), name: string (required), type: string (indexed), price: number (> 0), createdAt: timestamp

- Client: Use HTTP tools like Postman, Insomnia, or curl

- Scripts: Serverless offline for development and simulated serverless deployment for production

- No authentication

- Minimal data in local DynamoDB

- Everything runs locally without access to the real AWS

Please, change this description to be more clear to a coding IA, check the technology stack and the version of teh dependencies to ensure all technologies work well together. 

# Coding IA prompt
Project Overview:

Build a serverless REST API that allows users to:

- Register motorcycle parts
- Query available parts by type/category
The system must follow a serverless architecture pattern, using locally simulated AWS services (no real AWS deployment)

## Architecture
- Pattern: Serverless (Function-as-a-Service)
- Execution model: Stateless Lambda functions
- API style: RESTful HTTP API
- Environment: Fully local (offline simulation)
Each endpoint must be implemented as an independent Lambda function.

## Technology Stack
- Runtime: Node.js 18.x
- Framework: Serverless Framework (v3.x)
- Plugins:
    - serverless-offline (v12.x) → simulate API Gateway & Lambda locally
    - serverless-dynamodb-local (v0.2.x) → local DynamoDB
- SDK: AWS SDK for JavaScript v3
- Database: Amazon DynamoDB (local instance)
- Language: TypeScript (recommended) or JavaScript

## Project Structure (Layered Design)
The codebase must follow a layered architecture
### Layer Responsibilities
- Handlers
    - Parse HTTP requests
    - Validate input
    - Call services
    - Return HTTP responses
- Services (Business Logic)
    - Implement use cases
    - Enforce validation rules
    - Coordinate repositories
- Repositories
    - Interact with DynamoDB
    - No business logic
- Models
    - Define data structure and types

## Data Model
### Part Entity
Part {
  id: string;        // UUID (generated automatically)
  name: string;      // required, non-empty
  type: string;      // required, indexed (for querying)
  price: number;     // required, must be > 0
  createdAt: string; // ISO timestamp
}
### DynamoDB Table
- Table Name: Parts
- Primary Key: id (partition key)
- Global Secondary Index (GSI):
    - type-index
    - Partition key: type

## API Specification
### Create a Part
#### Endpoint:
POST /parts
#### Request Body:
{
  "name": "Brake Disc",
  "type": "brakes",
  "price": 49.99
}
#### Validation Rules:
- name → required, non-empty string
- type → required string
- price → number > 0

#### Response:
- 201 Created → returns created object
- 400 Bad Request → validation error

### Get Parts by Type
#### Endpoint:
GET /parts?type={type}
#### Query Params:
- type (required)
#### Response:
- 200 OK → list of matching parts
- 400 Bad Request → missing query param

## Local Development Setup
All services must run locally only, without AWS access.

## Testing the API
Use any HTTP client:
- Postman
- Insomnia
- curl (CLI)
Base URL (local): http://localhost:3000

## Constraints
- No authentication or authorization
- No external AWS services (everything must run locally)
- Minimal dataset (no seed required)
- Stateless functions only

## Implementation Notes
- Use modular AWS SDK v3 clients (e.g., @aws-sdk/client-dynamodb)
- Avoid monolithic handlers; each endpoint = separate function
- Use UUID generation for IDs (uuid package recommended)
- Ensure DynamoDB queries use the GSI for type filtering
- Return consistent JSON responses

## Expected Outcome
A fully working local serverless API that:
- Can register motorcycle parts
- Can query parts by type efficiently
- Follows clean architecture principles
- Is easily deployable to real AWS with minimal changes