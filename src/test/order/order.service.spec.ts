/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable jest/no-done-callback */
import { Test } from '@nestjs/testing';
import { AppConfigService } from '../../_common/services/app-config.service';
import { CategoriesRepository } from '../../_common/repositories/categories.repository';
import { OrdersRepository } from '../../_common/repositories/orders.repository';
import { StorageService } from '../../_common/services/storage.service';
import { OrderService } from '../../order/order.service';
import { TranslationsService } from '../../translations/translations.service';
import { mockData } from '../mockData';
import { AssetsService } from '../../_common/services/assets.service';
import { Brand } from '../../_common/enums/brand.enum';

const mockOrdersRepository = () => ({
  create: jest.fn().mockImplementation(() => Promise.resolve(mockData.order)),
  updateWith: jest.fn().mockImplementation(() => Promise.resolve(mockData.updateWithResponse))
});

const mockStorageService = () => ({
  uploadFileToStorageService: jest.fn(),
  getFileFromBlob: jest.fn(),
  generateSecuredUri: jest.fn(),
  getBlobUrl: jest.fn(() => 'undefined/assets/i/custom_photo_thumb_front.png')
});

const mockAppConfigService = () => ({
  storageConfig: { customImagesContainerName: 'custom-images' },
  assetsConfig: mockData.assetConfig,
  featureStatuses: mockData.featureStatuses
});

const mockCategoriesRepository = () => ({
  getCard: jest.fn()
});

const mockTranslationService = () => ({
  getTosAgreement: jest.fn(),
  getTosAgreementUpdatedAt: jest.fn(),
  parseJson: jest.fn(),
  getCache: jest.fn(),
  validateDate: jest.fn(),
  getDateFromAgreement: jest.fn()
});

describe('OrderService', () => {
  afterAll(async (done) => {
    if (!process.stdout.write('')) {
      process.stdout.once('drain', () => { done(); });
    }
  });

  let ordersRepository: OrdersRepository;
  let storageService: StorageService;
  let translationService: TranslationsService;
  let appconfigService: AppConfigService;
  let categoriesRepository: CategoriesRepository;
  let instance: OrderService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: OrderService, useValue: {} },
        { provide: StorageService, useFactory: mockStorageService },
        { provide: OrdersRepository, useFactory: mockOrdersRepository },
        { provide: AppConfigService, useFactory: mockAppConfigService },
        { provide: CategoriesRepository, useFactory: mockCategoriesRepository },
        { provide: TranslationsService, useFactory: mockTranslationService },
        { provide: AssetsService, useValue: {} }
      ]
    }).compile();

    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
    storageService = module.get<StorageService>(StorageService);
    appconfigService = module.get<AppConfigService>(AppConfigService);
    categoriesRepository = module.get<CategoriesRepository>(CategoriesRepository);
    translationService = module.get<TranslationsService>(TranslationsService);
    const assetsService = module.get<AssetsService>(AssetsService);

    instance = new OrderService(
      ordersRepository,
      categoriesRepository,
      appconfigService,
      storageService,
      translationService,
      assetsService
    );
  });

  describe('create', () => {
    it('should invoke ordersRepository.create with the correct params', async () => {
      const createSpy = jest.spyOn(ordersRepository, 'create').mockImplementation(() => Promise.resolve(mockData.order));
      await instance.create(
        mockData.orderRequestDto, mockData.referer,
        mockData.newUiVersion, mockData.userAgent
      );
      expect(createSpy).toHaveBeenCalledWith(
        mockData.orderRequestDto, mockData.referer,
        mockData.newUiVersion, null, Brand.Edible, mockData.userAgent, undefined
      );
    });

    it('should return the OrderResponseDto', async () => {
      const response = await instance.create(
        mockData.orderRequestDto, mockData.referer, mockData.newUiVersion, mockData.userAgent
      );
      expect(response).toEqual(mockData.orderResponseDto);
    });
  });

  describe('update', () => {
    it('should invoke ordersRepository.updateWith with the correct params', async () => {
      const updateWith = jest.spyOn(ordersRepository, 'updateWith').mockImplementation(() => Promise.resolve(mockData.updateWithResponse));
      await instance.update(mockData.orderUpdateRequest, mockData.printibleId);
      expect(updateWith).toHaveBeenCalledWith(mockData.orderUpdateRequest, mockData.printibleId);
    });

    it('should return the OrderUpdateResponseDto', async () => {
      const response = await instance.update(mockData.orderUpdateRequest, mockData.printibleId);
      expect(response).toEqual(mockData.orderUpdateResponseDto);
    });
  });
});
