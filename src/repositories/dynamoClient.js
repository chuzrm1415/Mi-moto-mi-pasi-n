const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

/**
 * Creates and returns a DynamoDB Document Client.
 * When running locally (IS_OFFLINE=true), it points to local DynamoDB on port 8000.
 */
const createDynamoDBClient = () => {
  const isOffline = process.env.IS_OFFLINE === 'true' || process.env.IS_OFFLINE === true;

  const clientConfig = isOffline
    ? {
        region: 'us-east-1',
        endpoint: 'http://localhost:8000',
        credentials: {
          accessKeyId: 'local',
          secretAccessKey: 'local',
        },
      }
    : {
        region: process.env.AWS_REGION || 'us-east-1',
      };

  const client = new DynamoDBClient(clientConfig);

  return DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  });
};

module.exports = { createDynamoDBClient };
