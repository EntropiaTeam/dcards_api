import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { mockData } from '../../test/mockData';
import {
  Agreement
} from '../../_common/types/translations.type';
import { Category } from '../../_common/types/category.type';

export class InitialDataResponseDto {
  @ApiProperty({ example: mockData.initialDataResponceDto.data })
  data!: {
    categories: Category[];
    tosAgreement: Agreement;
    cloudinaryFeatureFlag?: boolean;
  };
}
