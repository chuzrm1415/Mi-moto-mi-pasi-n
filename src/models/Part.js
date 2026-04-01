/**
 * Part model
 * Represents a motorcycle part in the marketplace.
 *
 * @typedef {Object} Part
 * @property {string} id        - UUID (auto-generated)
 * @property {string} name      - Name of the part (required)
 * @property {string} type      - Category/type of the part (indexed, required)
 * @property {number} price     - Price in USD, must be > 0 (required)
 * @property {string} createdAt - ISO timestamp (auto-generated)
 */

class Part {
  constructor({ id, name, type, price, createdAt }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.price = price;
    this.createdAt = createdAt;
  }

  /**
   * Validate the Part fields.
   * Returns an array of error messages (empty if valid).
   * @returns {string[]}
   */
  validate() {
    const errors = [];

    if (!this.name || typeof this.name !== 'string' || this.name.trim() === '') {
      errors.push('Field "name" is required and must be a non-empty string.');
    }

    if (!this.type || typeof this.type !== 'string' || this.type.trim() === '') {
      errors.push('Field "type" is required and must be a non-empty string.');
    }

    if (this.price === undefined || this.price === null) {
      errors.push('Field "price" is required.');
    } else if (typeof this.price !== 'number' || isNaN(this.price)) {
      errors.push('Field "price" must be a number.');
    } else if (this.price <= 0) {
      errors.push('Field "price" must be greater than 0.');
    }

    return errors;
  }

  /**
   * Serialize the Part to a plain object for DynamoDB storage.
   * @returns {Object}
   */
  toItem() {
    return {
      id: this.id,
      name: this.name.trim(),
      type: this.type.trim().toLowerCase(),
      price: this.price,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Part;
