export class HttpException extends Error{
    errorCode: number;
    status: number;
    errors: any;

    constructor(
      message: string,
      errorCode: number,
      status: number,
      errors: any = null
    ) {
      super(message); // Call the base Error class constructor
      this.errorCode = errorCode;
      this.status = status;
      this.errors = errors;
    }
    
}