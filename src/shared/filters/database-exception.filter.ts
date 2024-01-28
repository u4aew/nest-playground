import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const responsePayload = {
      statusCode: 400,
      message: 'Data validation error: Invalid data.',
    };

    if (process.env.NODE_ENV !== 'production') {
      responsePayload['error'] = exception.message;
    }

    response.status(400).json(responsePayload);
  }
}
