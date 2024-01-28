import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { OrderUpdateResponseDto } from '../dto/order-update-response.dto';

export function SwaggerUpdateOrder(): MethodDecorator {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Successful Order update',
      type: OrderUpdateResponseDto
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Payload Provided'
    }),
    ApiResponse({
      status: 401,
      description: 'Bad Token Provided'
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error'
    }),
    ApiOperation({
      summary: 'Update existing Printible Order with EAWeb order data'
    })
  );
}
