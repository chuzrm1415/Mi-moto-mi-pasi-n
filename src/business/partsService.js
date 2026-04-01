const { v4: uuidv4 } = require('uuid');
const Part = require('../models/Part');
const PartsRepository = require('../repositories/partsRepository');

/**
 * PartsService
 * Contains all business logic for the motorcycle parts marketplace.
 */
const PartsService = {
  /**
   * Register a new motorcycle part.
   *
   * @param {Object} data - Raw input data from the request body.
   * @param {string} data.name  - Name of the part (required).
   * @param {string} data.type  - Category/type of the part (required).
   * @param {number} data.price - Price of the part, must be > 0 (required).
   * @returns {Promise<Object>} The created part.
   * @throws {Object} Validation error with { statusCode, message }.
   */
  async createPart(data) {
    const part = new Part({
      id: uuidv4(),
      name: data.name,
      type: data.type,
      price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
      createdAt: new Date().toISOString(),
    });

    const errors = part.validate();
    if (errors.length > 0) {
      throw { statusCode: 400, message: errors.join(' ') };
    }

    const saved = await PartsRepository.save(part.toItem());
    return saved;
  },

  /**
   * List motorcycle parts, optionally filtered by type.
   *
   * @param {string|null} type - Optional type/category to filter by.
   * @returns {Promise<Object[]>} Array of matching parts.
   */
  async listParts(type) {
    if (type && typeof type === 'string' && type.trim() !== '') {
      return PartsRepository.findByType(type.trim());
    }

    return PartsRepository.findAll();
  },
};

module.exports = PartsService;
