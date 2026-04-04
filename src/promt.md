Exercise: Serverless API for a motorcycle parts marketplace. Build a system where users can list motorcycle parts and others can search for them by type or category, using decoupled functions and simulating a local serverless environment. Exercise in pairs.


Architecture: Serverless with Lambda functions + REST

Database: Local DynamoDB

Layers: Business logic, repositories, model

Uses local AWS SDK and plugins like serverless-offline

Write operation: POST /parts to register a part with name, type, and price

Read operation: GET /parts?type=x to list parts by type

Data model: Part: id: string (UUID), name: string (required), type: string (indexed), price: number (> 0), createdAt: timestamp

Client: Use HTTP tools like Postman, Insomnia, or curl

Scripts: Serverless offline for development and simulated serverless deployment for production

No authentication

Minimal data in local DynamoDB

Everything runs locally without access to the real AWS