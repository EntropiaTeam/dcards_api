// eslint-disable-next-line max-classes-per-file
import { INestApplication } from '@nestjs/common';
import { Readable } from 'stream';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import MockDate from 'mockdate';
import { PdfGenerationService } from '../src/_common/services/pdf-generation.service';
import { PdfData } from '../src/pdf/types/pdf-data.type';
import { StorageService } from '../src/_common/services/storage.service';
import { AppModule } from '../src/app.module';
import { AzureService } from '../src/_common/services/azure.service';
import { OrdersRepository } from '../src/_common/repositories/orders.repository';
import { CategoriesRepository } from '../src/_common/repositories/categories.repository';
import { card, newlyCreateOrder, imageBuffer } from './fixtures';

Error.stackTraceLimit = 20;

const validTime = new Date('2020-12-22T11:00:00.000Z');
MockDate.set('2020-12-23T10:00:00.000Z');

const validToken = Buffer.from(`${validTime.getTime()}`, 'utf-8').toString('base64');

const azureServiceMock = {
  // eslint-disable-next-line no-console
  trackException: jest.fn((err) => { console.log(err); })
};

describe('Pdf create', () => {
  jest.setTimeout(10_000);

  let app: INestApplication;

  class TestPdfGenerationService extends PdfGenerationService {
    generateBasePDFLayout(_pdf: PdfData): Promise<Buffer> {
      return Promise.resolve(Buffer.from('%PDF-1.0', 'utf-8'));
    }
  }

  class TestStorageService extends StorageService {
    getFileFromBlob(
      _fileUrl: string // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
      return Promise.resolve(imageBuffer);
    }

    // generateBasePDFLayout: () => Buffer.from('%PDF-1.0', 'utf-8')
    // generateSecuredUri: () => {},
    // getExistingBlob: () => 'https://steu2sprntdevstore01.blob.core.windows.net/assets/i/Photo_HappyHolidays_Test_thumb_front.png',
    isFileExist(
      _contName: string, // eslint-disable-line @typescript-eslint/no-unused-vars
      _fName: string // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
      return Promise.resolve(false);
    }

    uploadFileToStorageService(
      _stream: Readable, // eslint-disable-line @typescript-eslint/no-unused-vars
      _containerName: string, // eslint-disable-line @typescript-eslint/no-unused-vars
      _fileName: string // eslint-disable-line @typescript-eslint/no-unused-vars
    ): Promise<void> {
      throw new Error('Cant upload stream');
    }
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(AzureService)
      .useValue(azureServiceMock)
      .overrideProvider(OrdersRepository)
      .useValue({
        findOrder: () => newlyCreateOrder
      })
      .overrideProvider(CategoriesRepository)
      .useValue({
        getCard: () => card
      })
      .overrideProvider(StorageService)
      .useClass(TestStorageService)
      .overrideProvider(PdfGenerationService)
      .useClass(TestPdfGenerationService)
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

  test('PUT /pdf - show origin error on pdf upload failure', async () => {
    const requestBody = {
      ea_order_number: 'W-123456',
      store_number: '2286',
      employee_id: '12345'
    };
    const resp = await request(app.getHttpServer())
      .put('/api/pdf/5fe460c501aea31e29f6e4ea')
      .set('token', validToken)
      .send(requestBody);

    expect(resp.status).toBe(500);
    expect(azureServiceMock.trackException).toHaveBeenCalledTimes(1);
    expect(azureServiceMock.trackException).toHaveBeenCalledWith(
      new Error(`bodyPayload: ${JSON.stringify(requestBody)}, message: Cant upload stream`)
    );
  });
});
