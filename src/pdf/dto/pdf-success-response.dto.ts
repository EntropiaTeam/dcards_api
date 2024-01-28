import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Order } from '../../_common/entities/order.entity';
import { mockData } from '../../test/mockData';

export class PdfSuccessResponseDto {
  @ApiProperty({ example: mockData.PdfSuccessResponseDto.data })
  data!: {
    updatedOrder: Order;
  };
}
