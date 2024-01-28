import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Locale } from '../../_common/types/locale.type';

export class HeaderDto {
  @IsNotEmpty()
  @IsString()
  locale!: Locale;

  invalidate_cache!: boolean;

  @IsBoolean()
  hidephotocards!: string;

  referer!: string;
}
