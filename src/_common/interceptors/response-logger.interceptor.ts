import { Response } from 'express-serve-static-core';
import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor
} from '@nestjs/common';
import { performance } from 'perf_hooks';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getFixedDiff } from '../utils/get-fixed-diff';
import { isNotServerErrorStatusCode } from '../utils/is-not-server-error-status-code';
import { jsonStringifySafe } from '../utils/json-stringify-safe';
import { AzureService } from '../services/azure.service';
import { AppConfigService } from '../services/app-config.service';

type ResponseBody = Record<string, unknown> | string;

@Injectable()
export class ResponseLoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly telemetry: AzureService,
    private readonly appConfigService: AppConfigService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseBody> {
    const startedAt = performance.now();

    return next
      .handle()
      .pipe(
        tap<ResponseBody>((data) => {
          if (!this.appConfigService.azureTrackConfig.enableRequestsTracking) {
            return;
          }

          const response = context.switchToHttp().getResponse<Response>();
          const serviceName = context.getClass().name;
          const methodName = context.getHandler().name;

          const properties = {
            url: response.req?.originalUrl,
            method: response.req?.method,
            headers: jsonStringifySafe(response.getHeaders()),
            apiServiceName: serviceName,
            apiServiceMethodName: methodName
          };

          this.telemetry.trackDependency({
            name: 'Intercept-Response',
            data: jsonStringifySafe(data),
            properties,
            dependencyTypeName: 'https',
            duration: getFixedDiff(performance.now(), startedAt),
            resultCode: response.statusCode,
            success: isNotServerErrorStatusCode(response.statusCode)
          });
        })
      );
  }
}
