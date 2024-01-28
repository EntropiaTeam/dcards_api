import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiHeader } from '@nestjs/swagger/dist/decorators/api-header.decorator';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { InitialDataResponseDto } from '../dto/initial-data-response.dto';

export function SwaggerGetInitialData(): MethodDecorator {
  return applyDecorators(
    ApiHeader({
      name: 'locale',
      description: 'Locale filter for getting locale specific set of card designs and agreement. Example: en-US'
    }),
    ApiHeader({
      name: 'invalidate_cache',
      description: 'True to invalidate API cache. Example: true/false'
    }),
    ApiHeader({
      name: 'hidephotocards',
      description: 'True to exclude custom Cards/Categories from Category listing (for CloudSMS usage). Example: true/false'
    }),
    ApiResponse({
      status: 200,
      description: 'Success response with i18n agreement translation and Cards, grouped by Category',
      type: InitialDataResponseDto
    }),
    ApiResponse({
      status: 400,
      description: 'No or Invalid locale provided'
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error'
    }),
    ApiOperation({
      summary: 'Returns inital app data including all Printible Designs (Cards), grouped by category and i18n translation configuration for agreement'
    })
  );
}
