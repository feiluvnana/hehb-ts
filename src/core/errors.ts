export class ApiError {
  type: string;
  message: string;
  code: number;

  constructor(params: { type: string; message: string; code: number }) {
    this.type = params.type;
    this.message = params.message;
    this.code = params.code;
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super({ type: "BAD_REQUEST_ERROR", message, code: 400 });
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super({ type: "NOT_FOUND_ERROR", message, code: 404 });
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super({ type: "VALIDATION_ERROR", message, code: 422 });
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string) {
    super({ type: "INTERNAL_SERVER_ERROR", message, code: 500 });
  }
}
