import { HttpException } from "./root";

export class BadRequestException extends HttpException {
  constructor(message: string, errorCode: number = 400) {
    super(message, errorCode, 400, null);
    this.name = "BadRequestException";
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = "Not found") {
    super(message, 404, 404, null);
    this.name = "NotFoundException";
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = "Unauthorized") {
    super(message, 401, 401, null);
    this.name = "UnauthorizedException";
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}