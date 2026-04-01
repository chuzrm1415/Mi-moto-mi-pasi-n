/**
 * HTTP response helper for Lambda functions.
 * Ensures consistent response format across all functions.
 */

/**
 * Build a successful JSON response.
 * @param {number} statusCode - HTTP status code (e.g. 200, 201).
 * @param {*} body            - Response payload (will be JSON serialized).
 * @returns {Object} Lambda-compatible response object.
 */
const success = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(body),
});

/**
 * Build an error JSON response.
 * @param {number} statusCode - HTTP status code (e.g. 400, 500).
 * @param {string} message    - Human-readable error message.
 * @param {*} [details]       - Optional extra details for debugging.
 * @returns {Object} Lambda-compatible response object.
 */
const error = (statusCode, message, details = null) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify({
    error: true,
    message,
    ...(details && { details }),
  }),
});

module.exports = { success, error };
