import {
  Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Request } from 'express';
import { AzureService } from '../services/azure.service';

function decryptToken(token: string): number {
  return Number(CryptoJS.enc.Base64.parse(token).toString(CryptoJS.enc.Utf8));
}

interface IncomingRequest extends Request {
  headers: {
    token?: string;
  };
}

type PossibleTimestampParam = string | number | Date;

@Injectable()
class TimestampTokenGuard implements CanActivate {
  private readonly TOKEN_TIME_TO_LIVE = 86400000;

  constructor(private azureService: AzureService) {}

  private isTokenExpired(startSessionTimestamp: number, endSessionTimestamp: number): boolean {
    const sessionDuration: number = endSessionTimestamp - startSessionTimestamp;

    return sessionDuration > this.TOKEN_TIME_TO_LIVE;
  }

  private isValidTimestamp(timestamp: PossibleTimestampParam): boolean {
    return (new Date(timestamp)).getTime() > 0;
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: IncomingRequest = context.switchToHttp().getRequest();
    const { headers, body } = request;

    try {
      this.validateToken(headers.token, body);
    } catch (err) {
      this.azureService.trackException(err);
    }

    return true;
  }

  private validateToken(
    incomingToken: string | undefined,
    incomingPayload: Record<string, unknown>
  ) {
    let startSessionTimestamp = 0;
    const endSessionTimestamp: number = Date.now();

    // Check if token is in header
    if (!incomingToken) {
      throw new BadRequestException(
        `No token header provided \nbody: \n${JSON.stringify(incomingPayload)}`
      );
    }

    // Check if token is valid
    startSessionTimestamp = decryptToken(incomingToken);

    // Check if decrypted token is valid timestamp
    if (!this.isValidTimestamp(startSessionTimestamp)) {
      throw new BadRequestException(`Decrypted token is not a valid timestamp: ${
        incomingToken
      } \ndecrypted token: \n${startSessionTimestamp}`);
    }

    const isTokenExpired: boolean = this.isTokenExpired(
      startSessionTimestamp,
      endSessionTimestamp
    );

    // Check if token expired
    if (isTokenExpired) {
      const logPayload = {
        tokenTimestamp: startSessionTimestamp,
        currentTimestamp: endSessionTimestamp,
        tokenTime: new Date(startSessionTimestamp).toJSON(),
        currentTime: new Date(endSessionTimestamp).toJSON(),
        payload: incomingPayload
      };
      const tokenExpiredMsg = `Token expired: ${incomingToken} \n${JSON.stringify(logPayload)}`;
      throw new UnauthorizedException(tokenExpiredMsg);
    }
  }
}

export { TimestampTokenGuard };
