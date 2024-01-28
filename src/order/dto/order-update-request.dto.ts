import {
  IsOptional, IsString, IsDateString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class OrderUpdateRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2456' })
  ea_order_number!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '8674' })
  ea_store_number!: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2020-11-16T10:57:06.787Z' })
  fulfillment_date!: Date;
}
