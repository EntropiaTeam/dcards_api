/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Test } from '@nestjs/testing';
import MockDate from 'mockdate';
import { Print } from '../../pdf/enums/print.enum';
import { PdfGenerationService } from '../../_common/services/pdf-generation.service';
import { StorageService } from '../../_common/services/storage.service';
import { AppConfigService } from '../../_common/services/app-config.service';
import { CategoriesRepository } from '../../_common/repositories/categories.repository';
import { EmojiService } from '../../_common/services/emoji.service';
import { LegacyEmojiService } from '../../_common/services/emoji-legacy.service';
import { mockData } from '../mockData';
import { AssetsService } from '../../_common/services/assets.service';

const mockStorageService = () => ({
  getFileFromBlob: jest.fn()
});
const mockCategoriesRepository = () => ({
  getCard: jest.fn()
});

describe('PdfGenerationService', () => {
  let categoriesRepository: CategoriesRepository;
  let instance: PdfGenerationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PdfGenerationService,
        { provide: EmojiService, useValue: {} },
        { provide: LegacyEmojiService, useValue: {} },
        { provide: StorageService, useFactory: mockStorageService },
        { provide: AppConfigService, useValue: {} },
        { provide: CategoriesRepository, useFactory: mockCategoriesRepository },
        { provide: AssetsService, useValue: {} }
      ]
    }).compile();

    const emojiService = module.get<EmojiService>(EmojiService);
    const legacyEmojiService = module.get<LegacyEmojiService>(LegacyEmojiService);
    const storageService = module.get<StorageService>(StorageService);
    const appConfigService = module.get<AppConfigService>(AppConfigService);
    categoriesRepository = module.get<CategoriesRepository>(CategoriesRepository);
    const assetsService = module.get<AssetsService>(AssetsService);
    instance = new PdfGenerationService(
      emojiService, legacyEmojiService, storageService,
      appConfigService, categoriesRepository, assetsService
    );
    MockDate.set(1434319925275);
  });

  describe('generateUpdateDelta', () => {
    it('should return a PrintAttemptDelta', () => {
      const response = instance.generateUpdateDelta(
        mockData.order, mockData.pdfRequestDto, Print.Attempt, ''
      );
      expect(response).toEqual(mockData.printAttemptDelta);
    });

    it('should return a PrintSuccessDelta', () => {
      const response = instance.generateUpdateDelta(
        mockData.order, mockData.pdfRequestDto, Print.Success, ''
      );
      expect(response).toEqual(mockData.printSuccessDelta);
    });
  });

  describe('preparePdfData', () => {
    it('should return pdfData', async () => {
      jest.spyOn(categoriesRepository, 'getCard').mockResolvedValueOnce(mockData.cardDefinition);
      const response = await instance.preparePdfData(mockData.order, mockData.pdfRequestDto);
      expect(response).toEqual(mockData.preparePdfData);
    });
  });
});
