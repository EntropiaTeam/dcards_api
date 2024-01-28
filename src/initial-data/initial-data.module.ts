import { Module } from '@nestjs/common';
import { InitialDataController } from './initial-data.controller';
import { InitialDataService } from './initial-data.service';
import { TranslationsService } from '../translations/translations.service';
import { CommonModule } from '../_common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [InitialDataController],
  providers: [InitialDataService, TranslationsService]
})
export class InitialDataModule {}
