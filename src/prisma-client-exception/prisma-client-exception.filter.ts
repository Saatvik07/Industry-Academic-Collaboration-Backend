import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    const sendResponse = (status: HttpStatus) => {
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    };

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        sendResponse(status);
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        sendResponse(status);
        break;
      }
      case 'P2000': {
        const status = HttpStatus.BAD_REQUEST;
        sendResponse(status);
        break;
      }
      default:
        // default 500 error code
        super.catch(exception, host);
        break;
    }
    super.catch(exception, host);
  }
}
