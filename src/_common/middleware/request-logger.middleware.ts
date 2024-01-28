import { NextFunction, Request, Response } from 'express-serve-static-core';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AzureService } from '../services/azure.service';
import { jsonStringifySafe } from '../utils/json-stringify-safe';
import { AppConfigService } from '../services/app-config.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly telemetryService: AzureService,
    private readonly appConfigService: AppConfigService
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    if (!this.appConfigService.azureTrackConfig.enableRequestsTracking) {
      next();
      return;
    }

    const stringifiedBody = jsonStringifySafe(req.body);

    const properties = {
      url: req.baseUrl,
      method: req.method,
      query: jsonStringifySafe(req.query),
      body: stringifiedBody,
      headers: jsonStringifySafe(req.headers),
      cookies: jsonStringifySafe(req.cookies)
    };

    this.telemetryService.trackDependency({
      name: 'Intercept-Request',
      data: stringifiedBody,
      properties,
      dependencyTypeName: 'https',
      success: true,
      resultCode: 'init',
      duration: 0
    });

    next();
  }
}
