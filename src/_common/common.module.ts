import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageService, StorageServiceLocal } from './services/storage.service';
import { Order } from './entities/order.entity';
import { CacheService } from './services/cache.service';
import { AppConfigService } from './services/app-config.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { OrdersRepository } from './repositories/orders.repository';
import { SimpleHttpService } from './services/simple-http.service';
import { AzureService, AzureServiceLocal } from './services/azure.service';
import { CronOrdersRepository } from './repositories/cron-orders.repository';
import { AssetsService } from './services/assets.service';
import { PdfGenerationService } from './services/pdf-generation.service';
import { EmojiService } from './services/emoji.service';
import { LegacyEmojiService } from './services/emoji-legacy.service';
import { KeyVaultService } from './services/key-vault.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    HttpModule,
    TypeOrmModule.forFeature([Order])
  ],

  providers: [
    CacheService,
    SimpleHttpService,
    OrdersRepository,
    CronOrdersRepository,
    CategoriesRepository,
    {
      provide: AzureService,
      useClass:
        process.env.AZURE_TRACK_LOCALLY
          ? AzureServiceLocal
          : AzureService
    },
    AssetsService,
    PdfGenerationService,
    EmojiService,
    LegacyEmojiService,
    {
      provide: StorageService,
      useClass:
        process.env.USE_LOCAL_STORAGE_SERVICE
          ? StorageServiceLocal
          : StorageService
    },
    KeyVaultService,
    {
      provide: AppConfigService,
      inject: [ConfigService, KeyVaultService],
      useFactory: async (configService: ConfigService, keyVaultService: KeyVaultService) => {
        const appConfigService = new AppConfigService(configService, keyVaultService);
        await appConfigService.init();
        return appConfigService;
      }
    }
  ],
  exports: [
    CacheService,
    KeyVaultService,
    AppConfigService,
    SimpleHttpService,
    OrdersRepository,
    CronOrdersRepository,
    CategoriesRepository,
    StorageService,
    AzureService,
    AssetsService,
    PdfGenerationService,
    EmojiService,
    LegacyEmojiService,
    TypeOrmModule.forFeature([Order])
  ]
})
export class CommonModule {}
