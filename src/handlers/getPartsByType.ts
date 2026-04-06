import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { PartsService } from '../services/partsService';
import { success, badRequest, internalError, isValidationErrors } from './response';

const partsService = new PartsService();

/**
 * GET /parts?type={type}
 * Returns all parts matching the given type via DynamoDB GSI.
 */
export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const type = event.queryStringParameters?.type;
    const parts = await partsService.getPartsByType(type);
    return success(parts);
  } catch (error: unknown) {
    if (isValidationErrors(error)) {
      return badRequest(error);
    }

    console.error('[getPartsByType] Unexpected error:', error);
    return internalError();
  }
};
