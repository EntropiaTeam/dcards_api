import { CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

export class CallHandlerFake implements CallHandler {
  handle(): Observable<unknown> {
    return new Observable();
  }

  pipe(): void {}
}
