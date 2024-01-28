import { Test } from '@nestjs/testing';
import { Brand } from '../../_common/enums/brand.enum';
import { AppConfigService } from '../../_common/services/app-config.service';
import { CategoriesRepository } from '../../_common/repositories/categories.repository';
import { TranslationsService } from '../../translations/translations.service';
import { InitialDataService } from '../../initial-data/initial-data.service';
import { CacheService } from '../../_common/services/cache.service';
import { mockData } from '../mockData';

const mockCategoriesRepository = () => ({
  getData: jest.fn().mockResolvedValueOnce(mockData.allCategories)
    .mockResolvedValueOnce(mockData.allCards)
});

const mockCacheService = () => ({
  getCache: jest.fn(),
  setCache: jest.fn()
});

const mockAppConfigService = () => ({
  storageConfig: { url: 'www.mockurl.com' },
  featureStatuses: { photoCardsEnabled: false, overlayCardsEnabled: false }
});

describe('InitialDataService', () => {
  let categoriesRepository: CategoriesRepository;
  let appConfigService: AppConfigService;
  let translationsServiceInstance: TranslationsService;
  let initialDataServiceInstance: InitialDataService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: InitialDataService, useValue: {} },
        { provide: CategoriesRepository, useFactory: mockCategoriesRepository },
        { provide: AppConfigService, useFactory: mockAppConfigService },
        { provide: CacheService, useFactory: mockCacheService }
      ]
    }).compile();

    categoriesRepository = module.get<CategoriesRepository>(CategoriesRepository);
    appConfigService = module.get<AppConfigService>(AppConfigService);
    cacheService = module.get<CacheService>(CacheService);

    translationsServiceInstance = new TranslationsService(cacheService);
    initialDataServiceInstance = new InitialDataService(
      translationsServiceInstance, appConfigService, categoriesRepository
    );
  });

  describe('Get Categories as part of initial data', () => {
    it('should invoke categoriesRepository.getData with correct params', async () => {
      const getDataSpy = jest.spyOn(categoriesRepository, 'getData');
      await initialDataServiceInstance.getInitialData(
        mockData.headersDto.invalidate_cache,
        Brand.Edible,
        mockData.headersDto.locale,
        JSON.parse(mockData.headersDto.hidephotocards)
      );
      expect(getDataSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Get Agreement as part of initial data', () => {
    it('should invoke translationsService.getData with correct params', async () => {
      const getDataSpy = jest.spyOn(translationsServiceInstance, 'getTosAgreement');
      await initialDataServiceInstance.getInitialData(
        mockData.headersDto.invalidate_cache,
        Brand.Edible,
        mockData.headersDto.locale,
        JSON.parse(mockData.headersDto.hidephotocards)
      );
      expect(getDataSpy).toHaveBeenCalledWith(
        Brand.Edible, mockData.headersDto.locale, mockData.headersDto.invalidate_cache
      );
    });
  });
});
