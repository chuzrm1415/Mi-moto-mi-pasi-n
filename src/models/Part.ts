export interface Part {
  id: string;
  name: string;
  type: string;
  price: number;
  createdAt: string;
}

export interface CreatePartInput {
  name: string;
  type: string;
  price: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}
