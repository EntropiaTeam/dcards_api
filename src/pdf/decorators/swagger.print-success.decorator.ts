import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { PdfSuccessResponseDto } from '../dto/pdf-success-response.dto';

export function SwaggerPrintSuccess(): MethodDecorator {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Returns url to printable Printible PDF file',
      type: PdfSuccessResponseDto
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
