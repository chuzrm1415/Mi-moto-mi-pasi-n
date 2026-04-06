import { APIGatewayProxyResult } from 'aws-lambda';
import { ValidationError } from '../models/Part';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
};

export function success<T>(data: T, statusCode = 200): APIGatewayProxyResult {
  return {
    statusCode,
    headers: defaultHeaders,
    body: JSON.stringify(data),
  };
}

export function created<T>(data: T): APIGatewayProxyResult {
  return success(data, 201);
}

export function badRequest(errors: ValidationError[]): APIGatewayProxyResult {
  return {
    statusCode: 400,
    headers: defaultHeaders,
    body: JSON.stringify({
      error: 'Bad Request',
      details: errors,
    }),
  };
}

export function internalError(message = 'Internal Server Error'): APIGatewayProxyResult {
  return {
    statusCode: 500,
    headers: defaultHeaders,
    body: JSON.stringify({ error: message }),
  };
}

export function isValidationErrors(value: unknown): value is ValidationError[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof (value[0] as ValidationError).field === 'string'
  );
}
