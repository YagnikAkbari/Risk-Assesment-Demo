type HttpStatusCode =
  | 200 | 201 | 202 | 204
  | 400 | 401 | 403 | 404 | 409
  | 500 | 502 | 503;

export interface responseInterface<T = unknown> {
  code: HttpStatusCode;
  data: T;
  message: string;
  errors: unknown;
  response?: unknown;
  meta?: unknown;
  status?: number;
}
