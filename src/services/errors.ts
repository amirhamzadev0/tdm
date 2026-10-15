/** Error raised by the service layer that maps cleanly to an HTTP status. */
export class ServiceError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 404,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export class NotFoundError extends ServiceError {
  constructor(message = "Not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends ServiceError {
  constructor(message: string) {
    super(message, 400);
    this.name = "BadRequestError";
  }
}
