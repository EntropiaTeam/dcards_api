import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { mockData } from '../../test/mockData';

export class OrderResponseDto {
  @ApiProperty({ example: mockData.orderResponseDto.data })
  data!: {
    printibleID: string;
    previewUri: string;
    mediumPreviewUri: string;
  };
}
