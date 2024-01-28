import {
  Injectable, CanActivate, ExecutionContext, UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { AppConfigService } from '../services/app-config.service';
import { AzureService } from '../services/azure.service';

interface IncomingRequest extends Request {
  headers: {
    token: string;
  };
}

@Injectable()
class AuthTokenGuard implements CanActivate {
  constructor(private appConfigService: AppConfigService, private azureService: AzureService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: IncomingRequest = context.switchToHttp().getRequest();
    const { headers } = request;
    const incomingToken = headers.token;
    const incomingPayload = request.body;
    const isAuthTokenEnabled = this.appConfigService.featureStatuses.authTokenEnabled;

    // Check if token is in header
    if (!incomingToken) {
      const message = `No auth-token header provided \nbody: \n${JSON.stringify(incomingPayload)}`;
      const error = new UnauthorizedException({ message });

      if (isAuthTokenEnabled) {
        throw error;
      } else {
        this.azureService.trackException(error);
      }
    }

    return true;
  }
}

export { AuthTokenGuard };
