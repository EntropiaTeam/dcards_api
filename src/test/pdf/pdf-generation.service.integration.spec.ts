/* eslint-disable
  @typescript-eslint/restrict-template-expressions,
  @typescript-eslint/no-unused-vars,
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-explicit-any
*/
import * as fs from 'fs';
import * as path from 'path';
import { Test } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import type * as typeorm from 'typeorm';
import MockDate from 'mockdate';
import { BlockBlobClient } from '@azure/storage-blob';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/common';
import { Brand } from '../../_common/enums/brand.enum';
import { PdfGenerationService } from '../../_common/services/pdf-generation.service';
import { AzureService, AzureServiceLocal } from '../../_common/services/azure.service';
import { StorageService } from '../../_common/services/storage.service';
import { AppConfigService } from '../../_common/services/app-config.service';
import { CategoriesRepository } from '../../_common/repositories/categories.repository';
import { EmojiService } from '../../_common/services/emoji.service';
import { LegacyEmojiService } from '../../_common/services/emoji-legacy.service';
import { AssetsService } from '../../_common/services/assets.service';
import { PdfRequestDto } from '../../pdf/dto/pdf-request.dto';
import { CacheService } from '../../_common/services/cache.service';
import { KeyVaultService } from '../../_common/services/key-vault.service';
import { SimpleHttpService } from '../../_common/services/simple-http.service';
import { mockData } from '../mockData';

jest.createMockFromModule('pdfkit');

const categoriesRepositoryStub = {
  getCard(id: string) {
    return {
      id,
      name: 'Blank Photo Portrait Test',
      type: 'portrait',
      attributes: [],
      category: ['test'],
      tags: ['test'],
      culture: ['en-US', 'en-CA'],
      font: {
        family: 'Roboto Slab',
        size: '14',
        weight: '500',
        color: '#000'
      }
    };
  }
};
const notPrintedOrder = {
  _id: new ObjectId('60032d7c4777a0154075eaf1') as typeorm.ObjectID,
  referrer_url: '',
  user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
  customer_text: 'Happy Birthday Granny Rose\r\nWe love you \r\n-xoxo Spechelle & Christian ',
  definition_id: 'blank_photo_portrait',
  client_ip: '::ffff:127.0.0.1',
  tos_agreed: true,
  tos_update_date: new Date('2021-01-16T20:16:28.186+02:00'),
  ea_order_number: 'W1002374654-1',
  create_date: new Date('2021-01-16T20:16:28.186+02:00'),
  update_date: new Date('2021-01-16T20:18:05.296+02:00'),
  last_print_attempt_date: null,
  last_print_success_date: null,
  print_attempts_count: 0,
  print_successes_count: 0,
  printible_type: 'card',
  print_attempts: [],
  print_successes: [],
  origin_api_version: 'N-20201221.2',
  fulfillment_date: null,
  ea_store_number: '531',
  ui_version: '20201201.1',
  brand: Brand.Edible
};

const testStorageConfig = {
  name: '',
  key: '',
  url: '',
  connectionString: '',
  pdfContainerName: '',
  customImagesContainerName: '',
  cardAssetsContainerName: ''
};

const defaultPdfPageOptions = {
  options: {},
  rotation: {
    angle: 0,
    options: {}
  }
};
const defaultPdfLayout = {
  outsideFront: defaultPdfPageOptions,
  insidePrimary: defaultPdfPageOptions,
  outsideBack: defaultPdfPageOptions
};
const testPdfConfig = {
  customImage: { maxSize: 0 },
  landscape: defaultPdfLayout,
  portrait: defaultPdfLayout
};

describe('_common:services:PdfGenerationService', () => {
  jest.setTimeout(10_000);

  const blankPhotoPortraitPrintFront = fs.readFileSync(path.resolve(__dirname, 'fixtures/VDay_B2_print_front.png'));
  const blankPhotoPortraitPrintInside = fs.readFileSync(path.resolve(__dirname, 'fixtures/VDay_B2_print_inside.png'));
  const downloadedBlobs: string[] = [];

  let appConfigService: AppConfigService;
  let instance: PdfGenerationService;

  class TestStorageService extends StorageService {
    protected getBlobClient(blobName: string, containerName: string): BlockBlobClient {
      return {
        async uploadStream(
          stream: Readable,
          bSize?: number,
          maxConc?: number,
          opts?: any
        ): Promise<any> {
          return Promise.resolve();
        },
        downloadToBuffer(): Promise<Buffer> {
          if (blobName.includes('blank_photo_portrait_print_front.png')) {
            downloadedBlobs.push('blank_photo_portrait_print_front.png');
            return Promise.resolve(blankPhotoPortraitPrintFront);
          }
          if (blobName.includes('blank_photo_portrait_print_inside.png')) {
            downloadedBlobs.push('blank_photo_portrait_print_inside.png');
            return Promise.resolve(blankPhotoPortraitPrintInside);
          }
          throw new Error('blob doesn\'t exists');
        }
      } as any;
    }
  }

  beforeEach(async () => {
    const commonModule = await Test.createTestingModule({
      providers: [
        PdfGenerationService,
        EmojiService,
        LegacyEmojiService,
        AppConfigService,
        ConfigService,
        AssetsService,
        CacheService,
        { provide: AzureService, useClass: AzureServiceLocal },
        { provide: StorageService, useClass: TestStorageService },
        {
          provide: SimpleHttpService,
          useValue: {
            getDataAsBuffer: (fileUrl: string) => {
              if (fileUrl.includes('blank_photo_portrait_front.png')) {
                downloadedBlobs.push('blank_photo_portrait_front.png');
              } else if (fileUrl.includes('blank_photo_portrait_inside.png')) {
                downloadedBlobs.push('blank_photo_portrait_inside.png');
              } else if (fileUrl.includes('blank_photo_portrait_print_front.png')) {
                downloadedBlobs.push('blank_photo_portrait_print_front.png');
              }
              return (mockData.file.buffer);
            }
          }
        },
        {
          provide: HttpService,
          useValue: {}
        },
        { provide: CategoriesRepository, useValue: categoriesRepositoryStub },
        { provide: KeyVaultService, useValue: {} }
      ]
    }).compile();

    const emojiService = commonModule.get<EmojiService>(EmojiService);
    const legacyEmojiService = commonModule.get<LegacyEmojiService>(LegacyEmojiService);
    const storageService = commonModule.get<StorageService>(StorageService);
    appConfigService = commonModule.get<AppConfigService>(AppConfigService);
    const categoriesRepository = commonModule.get<CategoriesRepository>(CategoriesRepository);
    const assetsService = commonModule.get<AssetsService>(AssetsService);
    instance = new PdfGenerationService(
      emojiService, legacyEmojiService, storageService,
      appConfigService, categoriesRepository, assetsService
    );
    MockDate.set(1434319925275);
  });

  it('When: Images cached. Expected: `downloadToBuffer` not called', async () => {
    jest.spyOn(appConfigService, 'storageConfig', 'get').mockReturnValue(testStorageConfig);
    jest.spyOn(appConfigService, 'pdfConfig', 'get').mockReturnValue(testPdfConfig);
    jest.spyOn(appConfigService, 'assetsConfig', 'get').mockReturnValue(mockData.assetConfig);
    jest.spyOn(appConfigService, 'featureStatuses', 'get').mockReturnValue(mockData.featureStatuses);
    downloadedBlobs.length = 0;

    const printDto: PdfRequestDto = {
      store_number: '0000',
      employee_id: 'cron',
      ea_order_number: notPrintedOrder.ea_order_number ?? ''
    };
    const pdfData = await instance.preparePdfData(notPrintedOrder, printDto);
    await instance.generatePdf(pdfData);
    expect(downloadedBlobs).toEqual([
      'blank_photo_portrait_print_front.png',
      'blank_photo_portrait_print_inside.png'
    ]);

    // still the same amount of calls
    await instance.generatePdf(pdfData);
    expect(downloadedBlobs).toEqual([
      'blank_photo_portrait_print_front.png',
      'blank_photo_portrait_print_inside.png'
    ]);
  });
});
