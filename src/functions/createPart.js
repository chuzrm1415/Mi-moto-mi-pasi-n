const PartsService = require('../business/partsService');
const { success, error } = require('./response');

/**
 * POST /parts
 *
 * Registers a new motorcycle part in the marketplace.
 *
 * Request body (JSON):
 * {
 *   "name":  "Brake Pad Set",    // string, required
 *   "type":  "brakes",           // string, required (indexed)
 *   "price": 45.99               // number > 0, required
 * }
 *
 * Responses:
 *   201 - Part created successfully.
 *   400 - Validation error (missing/invalid fields).
 *   500 - Internal server error.
 */
module.exports.handler = async (event) => {
  try {
    let body;

    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return error(400, 'Invalid JSON in request body.');
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return error(400, 'Request body must be a JSON object.');
    }

    const part = await PartsService.createPart(body);

    return success(201, {
      message: 'Part registered successfully.',
      part,
    });
  } catch (err) {
    if (err.statusCode) {
      return error(err.statusCode, err.message);
    }

    console.error('[createPart] Unexpected error:', err);
    return error(500, 'Internal server error. Please try again later.');
  }
};
