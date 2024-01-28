// eslint-disable-next-line max-classes-per-file
import * as path from 'path';
import * as fs from 'fs';
import * as orm from 'typeorm';
import { Connection } from 'typeorm';
import { Test } from '@nestjs/testing';
import { ScheduleModule } from '@nestjs/schedule';
import { MongoRepository } from 'typeorm/repository/MongoRepository';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { EventTelemetry } from 'applicationinsights/out/Declarations/Contracts';
import { PdfGenerationService } from '../src/_common/services/pdf-generation.service';
import { AppConfigService } from '../src/_common/services/app-config.service';
import { AzureService, AzureServiceLocal } from '../src/_common/services/azure.service';
import { StorageService, StorageServiceLocal } from '../src/_common/services/storage.service';
import { CronOrdersRepository } from '../src/_common/repositories/cron-orders.repository';
import { Order } from '../src/_common/entities/order.entity';
import { CommonModule } from '../src/_common/common.module';
import { PrintEvent } from '../src/_common/entities/print-event.entity';
import { CategoriesRepository } from '../src/_common/repositories/categories.repository';
import { SchedulerService } from '../src/scheduler/scheduler.service';
import * as ordersFixture from '../src/scheduler/fixtures/orders.fixture';
import { DeleteObsoleteOrdersTask } from '../src/scheduler/tasks/delete-obsolete-orders.task';
import { GeneratePdfTask } from '../src/scheduler/tasks/generate-pdf.task';

describe('SchedulerService', () => {
  jest.setTimeout(10000);
  const metrics: { name: string; value: number }[] = [];
  const events: { name: string; properties?: Record<string, undefined> }[] = [];

  class TestSchedulerService extends SchedulerService {
    setupCronJobs(): void {}
  }

  // use assets from fixtures, otherwise read from "<project-root>/data" folder
  class TestStorageService extends StorageServiceLocal {
    async downloadBlobBuffer(containerName: string, blobName: string): Promise<Buffer> {
      const { cardAssetsContainerName } = this.appConfigService.storageConfig;
      if (containerName !== cardAssetsContainerName) {
        return super.downloadBlobBuffer(containerName, blobName);
      }

      const fileName = path.resolve(__dirname, 'fixtures', `${blobName.slice(2)}`);

      return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, buf) => {
          if (err) reject(err);
          else resolve(buf);
        });
      });
    }
  }

  class TestAzureService extends AzureServiceLocal {
    trackMetric(name: string, value: number) {
      metrics.push({ name, value });
      super.trackMetric(name, value);
    }

    trackEvent({ name, properties }: EventTelemetry) {
      events.push({ name, properties });
      super.trackEvent({ name, properties });
    }
  }

  let dbConn: orm.Connection;
  let mongoOrderRepo: MongoRepository<Order>;
  let storageService: StorageService;
  let deleteOrdersTask: DeleteObsoleteOrdersTask;
  let generatePdfTask: GeneratePdfTask;

  beforeEach(async () => {
    const module = await Test
      .createTestingModule({
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
          CommonModule
        ]
      })
      .overrideProvider(SchedulerService)
      .useClass(TestSchedulerService)
      .overrideProvider(StorageService)
      .useClass(TestStorageService)
      .overrideProvider(AzureService)
      .useClass(TestAzureService)
      .overrideProvider(CategoriesRepository)
      .useValue({ getCard: () => ordersFixture.card })
      .compile();

    const pdfGenerationService = module.get<PdfGenerationService>(PdfGenerationService);
    const cronOrdersRepository = module.get<CronOrdersRepository>(CronOrdersRepository);
    const azureService = module.get<AzureService>(AzureService);
    storageService = module.get<StorageService>(StorageService);

    dbConn = module.get<Connection>(Connection);
    mongoOrderRepo = dbConn.getMongoRepository<Order>(Order);

    generatePdfTask = new GeneratePdfTask(pdfGenerationService, cronOrdersRepository, azureService);
    deleteOrdersTask = new DeleteObsoleteOrdersTask(
      cronOrdersRepository, azureService, storageService
    );
  });
  afterEach(() => dbConn.close());

  test('order printing + deletion', async () => {
    if (await mongoOrderRepo.count({}) > 0) {
      await mongoOrderRepo.clear();
    }
    metrics.length = 0;
    events.length = 0;

    await mongoOrderRepo.save([
      ordersFixture.notPrintedOrder,
      ordersFixture.notPrintedObsoleteOrder,
      ordersFixture.notPrintedFulfilledObsoleteOrder,
      ordersFixture.notPrintedFulfilledOrder,
      ordersFixture.notPrintedAbandonedOrder,
      ordersFixture.printedOrder,
      ordersFixture.printedPaidNotFulfilledOrder,
      ordersFixture.fulfilledPrintedOrder,
      ordersFixture.fulfilledPrintedObsoletedOrder,
      ordersFixture.fulfilledWithoutDatePrintedOrder
    ]);

    await generatePdfTask.start();

    const notPrintedOrderPdfExists = await storageService
      .isFileExist('pdfs', ordersFixture.notPrintedOrder._id.toHexString());
    const notPrintedObsoleteOrderPdfExists = await storageService
      .isFileExist('pdfs', ordersFixture.notPrintedObsoleteOrder._id.toHexString());
    let notPrintedFulfilledObsoleteOrderPdfExists = await storageService
      .isFileExist('pdfs', ordersFixture.notPrintedFulfilledObsoleteOrder._id.toHexString());
    let notPrintedFulfilledOrderPdfExists = await storageService
      .isFileExist('pdfs', ordersFixture.notPrintedFulfilledOrder._id.toHexString());

    expect(notPrintedOrderPdfExists).toBe(false);
    expect(notPrintedObsoleteOrderPdfExists).toBe(false);
    // only fulfilled orders are printed
    expect(notPrintedFulfilledObsoleteOrderPdfExists).toBe(true);
    expect(notPrintedFulfilledOrderPdfExists).toBe(true);

    expect(metrics).toHaveLength(1);
    expect(metrics[0]).toStrictEqual({ name: 'print success', value: 2 });

    metrics.length = 0;

    await deleteOrdersTask.start(90, 30);

    const orders = await mongoOrderRepo.find({});
    const orderIds = orders.map((o: Order) => o._id);

    expect(events).toHaveLength(5);
    expect(events[0]).toStrictEqual({
      name: 'delete_obsolete_orders',
      properties: {
        orderId: ordersFixture.notPrintedObsoleteOrder._id.toHexString(),
        ok: true
      }
    });
    expect(events[1]).toStrictEqual({
      name: 'delete_obsolete_orders',
      properties: {
        orderId: ordersFixture.notPrintedFulfilledObsoleteOrder._id.toHexString(),
        ok: true
      }
    });
    expect(events[2]).toStrictEqual({
      name: 'delete_obsolete_orders',
      properties: {
        orderId: ordersFixture.notPrintedAbandonedOrder._id.toHexString(),
        ok: true
      }
    });
    expect(events[3]).toStrictEqual({
      name: 'delete_obsolete_orders',
      properties: {
        orderId: ordersFixture.printedPaidNotFulfilledOrder._id.toHexString(),
        ok: true
      }
    });
    expect(events[4]).toStrictEqual({
      name: 'delete_obsolete_orders',
      properties: {
        orderId: ordersFixture.fulfilledPrintedObsoletedOrder._id.toHexString(),
        ok: true
      }
    });

    expect(orderIds).toHaveLength(5);
    expect(orderIds).toContainEqual(ordersFixture.notPrintedOrder._id);
    expect(orderIds).toContainEqual(ordersFixture.printedOrder._id);
    expect(orderIds).toContainEqual(ordersFixture.notPrintedFulfilledOrder._id);
    expect(orderIds).toContainEqual(ordersFixture.fulfilledPrintedOrder._id);
    expect(orderIds).toContainEqual(ordersFixture.fulfilledWithoutDatePrintedOrder._id);

    notPrintedFulfilledObsoleteOrderPdfExists = await storageService
      .isFileExist('pdfs', ordersFixture.notPrintedFulfilledObsoleteOrder._id.toHexString());
    notPrintedFulfilledOrderPdfExists = await storageService
      .isFileExist('pdfs', ordersFixture.notPrintedFulfilledOrder._id.toHexString());

    // only fulfilled orders are printed
    // but obsoleted was removed
    expect(notPrintedFulfilledObsoleteOrderPdfExists).toBe(false);
    expect(notPrintedFulfilledOrderPdfExists).toBe(true);
  });
});
