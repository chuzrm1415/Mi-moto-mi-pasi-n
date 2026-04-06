import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from './dynamoClient';
import { Part } from '../models/Part';

export class PartsRepository {
  /**
   * Persists a new Part item to DynamoDB.
   */
  async create(part: Part): Promise<Part> {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: part,
    });

    await docClient.send(command);
    return part;
  }

  /**
   * Queries parts by type using the GSI (type-index).
   */
  async findByType(type: string): Promise<Part[]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'type-index',
      KeyConditionExpression: '#type = :type',
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':type': type,
      },
    });

    const result = await docClient.send(command);
    return (result.Items as Part[]) || [];
  }
}
