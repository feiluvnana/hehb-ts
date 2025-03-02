/* eslint-disable @typescript-eslint/no-explicit-any */
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

// START Bad Request Error

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super({ type: "BAD_REQUEST_ERROR", message, code: 400 });
  }
}

// END Bad Request Error

// START Unauthorized Error

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super({ type: "UNAUTHORIZED_ERROR", message, code: 401 });
  }
}

// END Unauthorized Error
// START Not Found Error

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super({ type: "NOT_FOUND_ERROR", message, code: 404 });
  }
}
export class NotFoundEntityError extends NotFoundError {
  constructor(params: { name: string; ids: string[] }) {
    super(`Can't find ${params.name}s of which ids are [${params.ids.join(", ")}]`);
  }
}

// END Not Found Error

// START Unprocessable Entity Error

export class UnprocessableEntityError extends ApiError {
  constructor(message: string) {
    super({ type: "UNPROCESSABLE_ENTITY_ERROR", message, code: 422 });
  }
}

// END Unprocessable Entity Error

// START Internal Server Error

export class InternalServerError extends ApiError {
  constructor(message: string) {
    super({ type: "INTERNAL_SERVER_ERROR", message, code: 500 });
  }
}

// END Internal Server Error
