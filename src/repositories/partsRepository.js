const { PutCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { createDynamoDBClient } = require('./dynamoClient');

const TABLE_NAME = process.env.DYNAMODB_TABLE;
const TYPE_INDEX = 'TypeIndex';

const docClient = createDynamoDBClient();

/**
 * PartsRepository
 * Handles all DynamoDB operations for the Parts table.
 */
const PartsRepository = {
  /**
   * Save a new part to DynamoDB.
   * @param {Object} item - The part item to store.
   * @returns {Promise<Object>} The stored item.
   */
  async save(item) {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)',
    });

    await docClient.send(command);
    return item;
  },

  /**
   * Query parts by type using the GSI TypeIndex.
   * @param {string} type - The part type/category to filter by.
   * @returns {Promise<Object[]>} List of matching parts.
   */
  async findByType(type) {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: TYPE_INDEX,
      KeyConditionExpression: '#type = :type',
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':type': type.toLowerCase(),
      },
      ScanIndexForward: false, // newest first
    });

    const result = await docClient.send(command);
    return result.Items || [];
  },

  /**
   * Scan all parts (no filter).
   * @returns {Promise<Object[]>} All parts in the table.
   */
  async findAll() {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const result = await docClient.send(command);

    // Sort by createdAt descending (newest first)
    const items = result.Items || [];
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
};

module.exports = PartsRepository;
