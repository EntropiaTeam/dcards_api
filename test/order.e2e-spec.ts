import * as request from 'supertest';
import MockDate from 'mockdate';
import { Test } from '@nestjs/testing';
import { INestApplication, BadRequestException } from '@nestjs/common';
import { join } from 'path';
import { getRepository } from 'typeorm';
import { OrdersRepository } from '../src/_common/repositories/orders.repository';
import { AzureService } from '../src/_common/services/azure.service';
import { AppModule } from '../src/app.module';
import { CategoriesRepository } from '../src/_common/repositories/categories.repository';
import { StorageService, StorageServiceLocal } from '../src/_common/services/storage.service';
import { Order } from '../src/_common/entities/order.entity';
import { card, newlyCreateOrder, imageBuffer } from './fixtures';

Error.stackTraceLimit = 20;

const expiredTime = new Date('2020-12-21T09:00:00.000Z');
const currentTime = new Date('2020-12-23T10:00:00.000Z');
const realDate = new Date();
MockDate.set(currentTime);

const validToken = Buffer.from(`${realDate.getTime()}`, 'utf-8').toString('base64');
const invalidToken = Buffer.from(`${expiredTime.getTime()}`, 'utf-8').toString('base64');

const azureServiceMock = {
  // eslint-disable-next-line no-console
  trackException: jest.fn((err) => { console.log(err); })
};

describe('Orders', () => {
  jest.setTimeout(10_000);

  let app: INestApplication;
  let storageService: StorageService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(AzureService)
      .useValue(azureServiceMock)
      .overrideProvider(StorageService)
      .useClass(StorageServiceLocal)
      .overrideProvider(CategoriesRepository)
      .useValue({
        getCard: () => card
      })
      .overrideProvider(OrdersRepository)
      .useValue({
        create: () => newlyCreateOrder
      })
      .compile();

    storageService = moduleRef.get<StorageService>(StorageService);

    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    if (app) await app.close();
  });

  beforeEach(() => {
    azureServiceMock.trackException.mockRestore();
  });

  test('POST /order', async () => {
    const resp = await request(app.getHttpServer())
      .post('/api/order')
      .set('token', validToken)
      .field('cardID', 'Photo_HappyHolidays_Test')
      .field('text', 'Happy order testing');

    expect(resp.status).toBe(201);
    expect(azureServiceMock.trackException).toHaveBeenCalledTimes(0);
  });

  test('POST /order should not allow to create order with any string tosAgreed', async () => {
    const resp = await request(app.getHttpServer())
      .post('/api/order')
      .set('token', validToken)
      .attach('file', join(__dirname, 'test_image.jpeg'), 'blob')
      .field('cardID', 'Photo_HappyHolidays_Test')
      .field('text', 'Happy order testing')
      .field('locale', 'en-CA')
      .field('tosAgreed', 'not false');

    expect(resp.status).toBe(400);
    expect(azureServiceMock.trackException).toHaveBeenCalledTimes(1);
  });

  test('POST /order valid with image', async () => {
    MockDate.reset();
    const resp = await request(app.getHttpServer())
      .post('/api/order')
      .set('token', validToken)
      .attach('file', join(__dirname, 'test_image.jpeg'), 'blob')
      .field('cardID', 'blank_photo_portrait')
      .field('text', 'Happy order testing')
      .field('locale', 'en-US')
      .field('tosAgreed', 'true');
    expect(resp.status).toBe(201);
    expect(azureServiceMock.trackException).toHaveBeenCalledTimes(0);
    MockDate.set(currentTime);

    const { body: { data: { printibleID = '' } } } = resp;
    const exist = await storageService.isFileExist('custom-images', printibleID);
    expect(exist).toBe(true);
  });

  test('POST /order valid image with strict tosAgreed true', async () => {
    MockDate.reset();
    const resp = await request(app.getHttpServer())
      .post('/api/order')
      .set('token', validToken)
      .attach('file', join(__dirname, 'test_image.jpeg'), 'blob')
      .field('cardID', 'blank_photo_portrait')
      .field('text', 'Happy order testing')
      .field('locale', 'en-US')
      .field('tosAgreed', true);
    expect(resp.status).toBe(201);
    expect(azureServiceMock.trackException).toHaveBeenCalledTimes(0);
    MockDate.set(currentTime);

    const { body: { data: { printibleID = '' } } } = resp;
    const exist = await storageService.isFileExist('custom-images', printibleID);
    expect(exist).toBe(true);
  });
});

describe('Orders real create', () => {
  jest.setTimeout(10_000);

  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(AzureService)
      .useValue(azureServiceMock)
      .overrideProvider(StorageService)
      .useClass(StorageServiceLocal)
      .overrideProvider(CategoriesRepository)
      .useValue({
        getCard: () => card
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    if (app) await app.close();
  });

  beforeEach(() => {
    azureServiceMock.trackException.mockRestore();
  });

  test('POST /order TOS stored in boolean type', async () => {
    MockDate.reset();
    const resp = await request(app.getHttpServer())
      .post('/api/order')
      .set('token', validToken)
      .attach('file', join(__dirname, 'test_image.jpeg'), 'blob')
      .field('cardID', 'blank_photo_portrait')
      .field('text', 'Happy order testing')
      .field('locale', 'en-US')
      .field('tosAgreed', true);
    expect(resp.status).toBe(201);
    expect(azureServiceMock.trackException).toHaveBeenCalledTimes(0);

    const { body: { data: { printibleID = '' } } } = resp;
    const createdOrder = await getRepository(Order).findOne(printibleID);
    if (createdOrder && Object.keys(createdOrder).length !== 0) {
      await getRepository(Order).delete(printibleID);
    }
    expect(createdOrder && createdOrder.tos_agreed).toBe(true);
    MockDate.set(currentTime);
  });
});

describe('Order creation with image when blob storage unauthorized', () => {
  jest.setTimeout(10_000);

  let app: INestApplication;
  const orders: Order[] = [];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(AzureService)
      .useValue(azureServiceMock)
      .overrideProvider(OrdersRepository)
      .useValue({
        create: () => {
          orders.push(newlyCreateOrder as unknown as Order);
          return newlyCreateOrder;
        }
      })
      .overrideProvider(CategoriesRepository)
      .useValue({
        getCard: () => card
      })
      .overrideProvider(StorageService)
      .useValue({
        uploadFileToStorageService: () => {
          const err = new Error('Authorization error') as unknown as Record<string, unknown>;
          err.statusCode = 403;
          err.request = { url: 'https://steu2sprntdevstore01.blob.core.windows.net/custom-images/5fe31520b531013abb4bbe71' };
          throw err as unknown as Error;
        },
        generateSecuredUri: () => {}
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    azureServiceMock.trackException.mockRestore();
  });

  test('POST /order - should not revert order and return 500', async () => {
    const reqBody = {
      cardID: 'Photo_HappyHolidays_Test',
      text: 'Happy order testing',
      locale: 'en-CA',
      tosAgreed: 'true'
    };
    const resp = await request(app.getHttpServer())
      .post('/api/order')
      .set('token', validToken)
      .attach('file', imageBuffer, 'blob')
      .field('cardID', reqBody.cardID)
      .field('text', reqBody.text)
      .field('locale', reqBody.locale)
      .field('tosAgreed', reqBody.tosAgreed);

    expect(resp.status).toBe(500);
    expect(azureServiceMock.trackException).toHaveBeenCalledTimes(1);
    expect(azureServiceMock.trackException).toHaveBeenCalledWith(
      new Error(`bodyPayload: ${JSON.stringify(reqBody)}, message: Authorization error`)
    );
    expect(orders.length).toBe(1);
    expect(orders[0]).toBe(newlyCreateOrder);
  });
});

describe('Orders errors', () => {
  jest.setTimeout(10_000);

  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(AzureService)
      .useValue(azureServiceMock)
      .overrideProvider(OrdersRepository)
      .useFactory({
        factory() {
          return {
            create: () => { throw new Error('Unknown/unprocessable internal error'); }
          };
        }
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    azureServiceMock.trackException.mockRestore();
  });
  afterEach(async () => {
    await app.close();
  });

  test('report origin error if cant handle it', async () => {
    const reqBody = {
      cardID: 'Photo_HappyHolidays_Test',
      text: 'Happy order testing - invalid token'
    };
    const resp = await request(app.getHttpServer())
      .post('/api/order')
      .set('token', validToken)
      .field('cardID', reqBody.cardID)
      .field('text', reqBody.text);

    expect(resp.status).toBe(500);
    expect(azureServiceMock.trackException).toHaveBeenCalledTimes(1);
    expect(azureServiceMock.trackException).toHaveBeenCalledWith(
      new Error(`bodyPayload: ${JSON.stringify(reqBody)}, message: Unknown/unprocessable internal error`)
    );
  });
});
