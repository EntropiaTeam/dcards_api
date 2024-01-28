import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AppController } from './app.controller';
import { OrderModule } from './order/order.module';
import { PdfModule } from './pdf/pdf.module';
import { TranslationsModule } from './translations/translations.module';
import { CommonModule } from './_common/common.module';
import { BaseExceptionFilter } from './_common/filters/base-exception.filter';
import { TransformHeadersInterceptor } from './_common/interceptors/transform-headers.interceptor';
import { ResponseLoggerInterceptor } from './_common/interceptors/response-logger.interceptor';
import { RequestLoggerMiddleware } from './_common/middleware/request-logger.middleware';
import { AppConfigService } from './_common/services/app-config.service';
import { Order } from './_common/entities/order.entity';
import { PrintEvent } from './_common/entities/print-event.entity';
import { InitialDataModule } from './initial-data/initial-data.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [CommonModule],
      useFactory: (appConfigService: AppConfigService) => ({
        ...appConfigService.database,
        entities: [Order, PrintEvent]
      }),
      inject: [AppConfigService]
    }),
    CommonModule,
    OrderModule,
    PdfModule,
    TranslationsModule,
    InitialDataModule,
    SchedulerModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: BaseExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformHeadersInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseLoggerInterceptor
    }
  ],
  controllers: [AppController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('*');
  }
}
