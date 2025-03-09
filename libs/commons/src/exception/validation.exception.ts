
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { errors } from '@vinejs/vine'
import { ValidationError } from '@vinejs/vine/build/src/errors/validation_error';
import { Response } from 'express';

@Catch(errors.E_VALIDATION_ERROR)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.status;
    const message = exception.message;
    const messages = exception.messages;

    return response
      .status(status)
      .send({
        statusCode: status,
        message,
        errors: messages,
      });
  }
}
