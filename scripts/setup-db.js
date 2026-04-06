#!/usr/bin/env node

/**
 * Local DynamoDB setup script.
 * Run this if you need to manually create the Parts table
 * when not using serverless-dynamodb-local's auto-migrate.
 *
 * Usage: node scripts/setup-db.js
 */

const {
  DynamoDBClient,
  CreateTableCommand,
  ListTablesCommand,
} = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local',
  },
});

const TABLE_NAME = 'Parts';

async function createTable() {
  try {
    // Check if table already exists
    const listResult = await client.send(new ListTablesCommand({}));
    if (listResult.TableNames?.includes(TABLE_NAME)) {
      console.log(`✅ Table "${TABLE_NAME}" already exists — skipping creation.`);
      return;
    }

    await client.send(
      new CreateTableCommand({
        TableName: TABLE_NAME,
        BillingMode: 'PAY_PER_REQUEST',
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' },
          { AttributeName: 'type', AttributeType: 'S' },
        ],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'type-index',
            KeySchema: [{ AttributeName: 'type', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
          },
        ],
      })
    );

    console.log(`✅ Table "${TABLE_NAME}" created successfully.`);
    console.log('   - Primary Key: id (HASH)');
    console.log('   - GSI: type-index (type HASH)');
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log(`ℹ️  Table "${TABLE_NAME}" already exists.`);
    } else {
      console.error('❌ Failed to create table:', err.message);
      process.exit(1);
    }
  }
}

createTable();
