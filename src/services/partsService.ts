import { v4 as uuidv4 } from 'uuid';
import { Part, CreatePartInput, ValidationError } from '../models/Part';
import { PartsRepository } from '../repositories/partsRepository';

export class PartsService {
  private repository: PartsRepository;

  constructor() {
    this.repository = new PartsRepository();
  }

  /**
   * Validates input and creates a new motorcycle part.
   * @throws {ValidationError[]} if input is invalid
   */
  async createPart(input: CreatePartInput): Promise<Part> {
    const errors = this.validateCreateInput(input);
    if (errors.length > 0) {
      throw errors;
    }

    const part: Part = {
      id: uuidv4(),
      name: input.name.trim(),
      type: input.type.trim(),
      price: input.price,
      createdAt: new Date().toISOString(),
    };

    return this.repository.create(part);
  }

  /**
   * Returns all parts that match the given type, using GSI.
   * @throws {ValidationError[]} if type param is missing
   */
  async getPartsByType(type: string | undefined): Promise<Part[]> {
    if (!type || type.trim() === '') {
      throw [{ field: 'type', message: 'Query parameter "type" is required' }] as ValidationError[];
    }

    return this.repository.findByType(type.trim());
  }

  /**
   * Validates the fields for part creation.
   */
  private validateCreateInput(input: CreatePartInput): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!input.name || typeof input.name !== 'string' || input.name.trim() === '') {
      errors.push({ field: 'name', message: '"name" is required and must be a non-empty string' });
    }

    if (!input.type || typeof input.type !== 'string' || input.type.trim() === '') {
      errors.push({ field: 'type', message: '"type" is required and must be a non-empty string' });
    }

    if (input.price === undefined || input.price === null) {
      errors.push({ field: 'price', message: '"price" is required' });
    } else if (typeof input.price !== 'number' || isNaN(input.price) || input.price <= 0) {
      errors.push({ field: 'price', message: '"price" must be a number greater than 0' });
    }

    return errors;
  }
}
