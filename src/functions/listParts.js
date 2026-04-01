const PartsService = require('../business/partsService');
const { success, error } = require('./response');

/**
 * GET /parts
 * GET /parts?type=brakes
 *
 * Lists motorcycle parts from the marketplace.
 * Optionally filters by type using the query string parameter `type`.
 *
 * Query Parameters:
 *   type (optional) - Filter parts by category/type (e.g. "brakes", "engine", "exhaust").
 *
 * Responses:
 *   200 - Array of parts (may be empty).
 *   500 - Internal server error.
 *
 * Examples:
 *   GET /parts              → returns all parts
 *   GET /parts?type=brakes  → returns only parts of type "brakes"
 */
module.exports.handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const type = queryParams.type || null;

    const parts = await PartsService.listParts(type);

    return success(200, {
      count: parts.length,
      parts,
      ...(type && { filter: { type } }),
    });
  } catch (err) {
    if (err.statusCode) {
      return error(err.statusCode, err.message);
    }

    console.error('[listParts] Unexpected error:', err);
    return error(500, 'Internal server error. Please try again later.');
  }
};
