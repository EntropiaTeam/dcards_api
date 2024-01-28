import {
  IsNotEmpty, IsString, IsOptional, ValidateIf, MaxLength
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Locale } from '../../_common/types/locale.type';

export class OrderRequestDto {
  @ApiProperty({ example: 'Thanksgiving_A' })
  @IsNotEmpty()
  @IsString()
  cardID!: string;

  @ApiProperty({ example: 'Happy Thanksgiving!' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1500, {
    message: 'Text is too long'
  })
  text!: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @Transform((it) => {
    switch (it) {
      case true:
      case 'true':
        return true;
      default:
        return false;
    }
  })
  tosAgreed?: boolean;

  @ApiProperty({ example: 'en-US' })
  @ValidateIf(({ tosAgreed }: { tosAgreed: boolean | undefined }) => !!tosAgreed)
  locale?: Locale;
}
