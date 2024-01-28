import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiHeader } from '@nestjs/swagger/dist/decorators/api-header.decorator';
import { ApiConsumes } from '@nestjs/swagger/dist/decorators/api-consumes.decorator';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { OrderResponseDto } from '../dto/order-response.dto';

export function SwaggerCreateOrder(): MethodDecorator {
  return applyDecorators(
    ApiHeader({
      name: 'token',
      description:
      'Security Token (base64 encoded timestamp)'
    }),
    ApiResponse({
      status: 201,
      description: 'Successful Order Creation',
      type: OrderResponseDto
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
    ApiOperation({ summary: 'Create a new Printible Order' }),
    ApiConsumes('multipart/form-data'),
    ApiImplicitFile({ name: 'file', required: false })
  );
}
