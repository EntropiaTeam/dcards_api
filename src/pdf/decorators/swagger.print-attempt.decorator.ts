import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { PdfAttemptResponseDto } from '../dto/pdf-attempt-response.dto';

export function SwaggerPrintAttempt(): MethodDecorator {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Returns url to printable Printible PDF file',
      type: PdfAttemptResponseDto
    }),
    ApiResponse({
      status: 400,
      description: 'No or Invalid Printible ID or/and bad payload provided'
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error'
    }),
    ApiOperation({
      summary: 'Returns URL to Printible PDF'
    })
  );
}
