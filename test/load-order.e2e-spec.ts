// eslint-disable-next-line max-classes-per-file
import { HttpService, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoRepository } from 'typeorm/repository/MongoRepository';
import { Test } from '@nestjs/testing';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CacheService } from '../src/_common/services/cache.service';
import { AppConfigService } from '../src/_common/services/app-config.service';
import { SimpleHttpService } from '../src/_common/services/simple-http.service';
import { OrdersRepository } from '../src/_common/repositories/orders.repository';
import { Order } from '../src/_common/entities/order.entity';
import { CronOrdersRepository } from '../src/_common/repositories/cron-orders.repository';
import { StorageService } from '../src/_common/services/storage.service';
import { AzureService } from '../src/_common/services/azure.service';
import { AppModule } from '../src/app.module';
import { PdfService } from '../src/pdf/pdf.service';
import { PdfGenerationService } from '../src/_common/services/pdf-generation.service';
import { SchedulerService } from '../src/scheduler/scheduler.service';
import { OrderService } from '../src/order/order.service';
import { TranslationsService } from '../src/translations/translations.service';
import { CategoriesRepository } from '../src/_common/repositories/categories.repository';
import { AssetsService } from '../src/_common/services/assets.service';

let app: INestApplication;
const modulesLoadedList: string[] = [];

describe('App load', () => {
  class TestAppConfigService extends AppConfigService {
    constructor(opts: ConfigService) {
      modulesLoadedList.push('AppConfigService');
      super(opts);
    }
  }

  class TestAzureService extends AzureService {
    constructor(
      appConfigService: AppConfigService
    ) {
      modulesLoadedList.push('AzureService');
      super(appConfigService);
    }

    trackException(error: Error): void {
      console.log(error); // eslint-disable-line no-console
    }
  }

  class TestCacheService extends CacheService {
    constructor() {
      modulesLoadedList.push('CacheService');
      super();
    }
  }
  class TestSimpleHttpService extends SimpleHttpService {
    constructor(opts: HttpService) {
      modulesLoadedList.push('SimpleHttpService');
      super(opts);
    }
  }
  class TestCronOrdersRepository extends CronOrdersRepository {
    constructor(opts: MongoRepository<Order>) {
      modulesLoadedList.push('CronOrdersRepository');
      super(opts);
    }
  }
  class TestStorageService extends StorageService {
    constructor(
      appConfigService: AppConfigService
    ) {
      modulesLoadedList.push('StorageService');
      super(appConfigService);
    }
  }

  class TestPdfService extends PdfService {
    constructor(
      ordersRepository: OrdersRepository,
      storageService: StorageService,
      pdfGenerationService: PdfGenerationService
    ) {
      modulesLoadedList.push('PdfService');
      super(ordersRepository, storageService, pdfGenerationService);
    }
  }

  class TestSchedulerService extends SchedulerService {
    constructor(
      pdfGenerationService: PdfGenerationService,
      schedulerRegistry: SchedulerRegistry,
      cronOrdersRepository: CronOrdersRepository,
      appConfigService: AppConfigService,
      azureService: AzureService,
      storageService: StorageService
    ) {
      modulesLoadedList.push('SchedulerService');
      super(
        pdfGenerationService,
        schedulerRegistry,
        cronOrdersRepository,
        appConfigService,
        azureService,
        storageService
      );
    }
  }

  class TestOrderService extends OrderService {
    constructor(
      ordersRepository: OrdersRepository,
      categoriesRepository: CategoriesRepository,
      appConfigService: AppConfigService,
      storageService: StorageService,
      translationsService: TranslationsService,
      assetsService: AssetsService
    ) {
      modulesLoadedList.push('OrderService');
      super(
        ordersRepository,
        categoriesRepository,
        appConfigService,
        storageService,
        translationsService,
        assetsService
      );
    }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(AppConfigService)
      .useClass(TestAppConfigService)
      .overrideProvider(AzureService)
      .useClass(TestAzureService)
      .overrideProvider(StorageService)
      .useClass(TestStorageService)
      .overrideProvider(CacheService)
      .useClass(TestCacheService)
      .overrideProvider(SimpleHttpService)
      .useClass(TestSimpleHttpService)
      .overrideProvider(CronOrdersRepository)
      .useClass(TestCronOrdersRepository)
      .overrideProvider(PdfService)
      .useClass(TestPdfService)
      .overrideProvider(SchedulerService)
      .useClass(TestSchedulerService)
      .overrideProvider(OrderService)
      .useClass(TestOrderService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    if (app) await app.close();
  });

  test('service loading order', () => {
    expect(modulesLoadedList).toStrictEqual([
      'CacheService',
      'SimpleHttpService',
      'AppConfigService',
      'AppConfigService',
      'AzureService',
      'StorageService',
      'CronOrdersRepository',
      'SchedulerService'
    ]);
  });
});
