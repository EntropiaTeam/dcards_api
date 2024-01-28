import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpRequest } from 'applicationinsights/out/Library/Functions';

export const HidePhotoCards = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: HttpRequest = ctx.switchToHttp().getRequest();
    const hidePhotoCardsHeader = request.headers.hidephotocards;
    let hidePhotoCards: boolean;

    try {
      hidePhotoCards = JSON.parse(hidePhotoCardsHeader);
    } catch {
      hidePhotoCards = false;
    }

    return hidePhotoCards;
  }
);
