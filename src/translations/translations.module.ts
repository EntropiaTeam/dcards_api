import { Module } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { CommonModule } from '../_common/common.module';

@Module({
  imports: [CommonModule],
  providers: [TranslationsService],
  exports: [TranslationsService]
})
export class TranslationsModule {}
