import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { PartsService } from '../services/partsService';
import { CreatePartInput } from '../models/Part';
import { created, badRequest, internalError, isValidationErrors } from './response';

const partsService = new PartsService();

/**
 * POST /parts
 * Registers a new motorcycle part.
 */
export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return badRequest([{ field: 'body', message: 'Request body is required' }]);
    }

    let input: CreatePartInput;
    try {
      input = JSON.parse(event.body) as CreatePartInput;
    } catch {
      return badRequest([{ field: 'body', message: 'Invalid JSON in request body' }]);
    }

    const part = await partsService.createPart(input);
    return created(part);
  } catch (error: unknown) {
    if (isValidationErrors(error)) {
      return badRequest(error);
    }

    console.error('[createPart] Unexpected error:', error);
    return internalError();
  }
};
