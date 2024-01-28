import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as requestIp from 'request-ip';

export const IpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    return requestIp.getClientIp(request);
  }
);
