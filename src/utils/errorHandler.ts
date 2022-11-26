import { HttpException, Logger } from "@nestjs/common";

export const ErrorHandler = (
  code?: number,
  error?: Error,
  message?:
    | string
    | {
        code: number;
        message: string;
        next_link?: string;
        decode_pass?: string;
      }
) => {
  Logger.error(error || message);

  switch (code) {
    case 400:
      throw new ClientException(error || message);
    case 401:
      throw new AuthenticationException(error || message);
    case 403:
      throw new NotAllowedException(error || message);
    case 404:
      throw new NotFoundException(error || message);
    case 409:
      throw new ClientInputException(error || message);
    default:
      throw new ServerException(error || message);
  }
};

//400
export class ClientException extends HttpException {
  constructor(message?) {
    super(message || "CLIENT SIDE ERROR", 400);
  }
}

//401
export class AuthenticationException extends HttpException {
  constructor(message?) {
    super(message || "NOT AUTHENTICATION", 401);
  }
}

//403
export class NotAllowedException extends HttpException {
  constructor(message?) {
    super(message || "NOT AUTORIZATION", 403);
  }
}

//404
export class NotFoundException extends HttpException {
  constructor(message?) {
    super(message || "NOT FOUND", 404);
  }
}

//409
export class ClientInputException extends HttpException {
  constructor(message?) {
    super(message || "CONFLICT", 409);
  }
}

//500
export class ServerException extends HttpException {
  constructor(message?) {
    super(message || "SERVER SIDE ERROR", 500);
  }
}
