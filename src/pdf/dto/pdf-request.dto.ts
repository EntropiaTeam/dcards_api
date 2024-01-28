import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class PdfRequestDto {
  @ApiProperty({ example: '2456' })
  @IsNotEmpty()
  @IsString()
  store_number!: string;

  @ApiProperty({ example: '4528' })
  @IsNotEmpty()
  @IsString()
  employee_id!: string;

  @ApiProperty({ example: 'W2000-024084-1-6' })
  @IsOptional()
  @IsString()
  ea_order_number?: string;
}
