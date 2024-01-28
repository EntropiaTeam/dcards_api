import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class TransformHeadersInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response> {
    return next.handle().pipe(
      map((data: Response) => {
        const res: Response = context.switchToHttp().getResponse();
        if (!res.headersSent) {
          res.set('X-Service-Version', process.env.APP_VERSION);
        }
        return data;
      })
    );
  }
}
