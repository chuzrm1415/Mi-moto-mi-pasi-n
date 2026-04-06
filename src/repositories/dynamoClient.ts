import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const isLocal =
  process.env.IS_OFFLINE === 'true' ||
  process.env.DYNAMODB_ENDPOINT !== undefined;

const clientConfig = isLocal
  ? {
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
      },
    }
  : {
      region: process.env.AWS_REGION || 'us-east-1',
    };

const dynamoDBClient = new DynamoDBClient(clientConfig);

export const docClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false,
  },
});

export const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Parts';
