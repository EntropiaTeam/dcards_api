import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CommonModule } from '../_common/common.module';
import { TranslationsService } from '../translations/translations.service';
@Module({
  imports: [CommonModule],
  controllers: [OrderController],
  providers: [OrderService, TranslationsService]
})
export class OrderModule {}
