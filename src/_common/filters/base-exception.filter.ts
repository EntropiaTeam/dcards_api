import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Response, Request } from 'express-serve-static-core';
import { MongoError } from 'mongodb';
import { AzureService } from '../services/azure.service';
import { AppConfigService } from '../services/app-config.service';
import { BaseExceptionResponse } from '../types/base-exception-response.type';

type MongodbSubError ={
  servers: Map<string, { error?: MongoError }>;
  type: string;
};
type MongodbErrReason = string | MongodbSubError;

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  constructor(private azureService: AzureService, private appConfigService: AppConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const augmentedException = <Error & { reason?: MongodbErrReason }>exception;
    if (request.body) {
      augmentedException.message = `bodyPayload: ${JSON.stringify(request.body)}, message: ${exception.message}`;
    }
    if (augmentedException.reason) {
      const { host: hostName, port = 10255 } = this.appConfigService.database;
      const reason = BaseExceptionFilter
        .getMongodbReason(augmentedException.reason, port, hostName);
      augmentedException.message = `${exception.message}, reason: ${reason}`;
    }
    this.azureService.trackException(exception);

    let sendResponse: BaseExceptionResponse;
    if (exception instanceof HttpException) {
      sendResponse = <BaseExceptionResponse>exception.getResponse();
    } else {
      const ex = <Error>exception;
      sendResponse = { error: 'Internal Server Error', message: ex.message, statusCode: status };
    }

    if (this.appConfigService.exceptionConfig.suppressExceptionResponseMessages) {
      sendResponse = { ...sendResponse, message: null };
    }
    if (!response.headersSent) {
      response.status(status).send(sendResponse);
    }
  }

  static getMongodbReason(reason: MongodbErrReason, port = 10255, hostName?: string): string {
    if (!hostName) return '';
    if (typeof reason === 'string') return reason;

    const dbSchema = `${hostName}:${port}`;

    const subErr = reason.servers?.get(dbSchema)?.error;

    return JSON.stringify({
      name: reason.constructor.name,
      type: reason.type,
      subErr: subErr && `${subErr?.message} ${subErr?.name}`
    });
  }
}
