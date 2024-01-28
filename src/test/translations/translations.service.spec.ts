import { Test } from '@nestjs/testing';
import * as fs from 'fs';

import { TranslationsService } from '../../translations/translations.service';
import { CacheService } from '../../_common/services/cache.service';
import { mockData } from '../mockData';
import { Agreement, TranslationCache } from '../../_common/types/translations.type';
import { Locale } from '../../_common/types/locale.type';
import { Brand } from '../../_common/enums/brand.enum';

const mockCacheService = () => ({
  getCache: jest.fn(),
  setCache: jest.fn()
});

describe('TranslationsService', () => {
  let translationsServiceInstance: TranslationsService;
  let cacheService: CacheService;
  const EnUSlocale = 'en-US' as Locale;
  const EnCAlocale = 'en-CA' as Locale;
  const FrCAlocale = 'fr-CA' as Locale;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: CacheService, useFactory: mockCacheService }
      ]
    }).compile();

    cacheService = module.get<CacheService>(CacheService);

    translationsServiceInstance = new TranslationsService(cacheService);
  });

  it('Should return agreement according to locale argument', () => {
    const agreementToCache: TranslationCache<Agreement> = JSON.parse(
      fs.readFileSync(`${TranslationsService.TRANSLATIONS_DIR}/${TranslationsService.TOS_AGREEMENT_FILE}`, 'utf8')
    );

    const agreement = translationsServiceInstance.getTosAgreement(
      Brand.Dcards, EnUSlocale, mockData.headersDto.invalidate_cache
    );
    expect(agreement.data).toEqual(agreementToCache[Brand.Dcards][EnUSlocale]);
  });

  it('Should return agreement update date for en-US locale', () => {
    const agreementUpdateDate = translationsServiceInstance.getTosAgreementUpdatedAt(
      Brand.Dcards, EnUSlocale
    );
    expect(agreementUpdateDate).toBeInstanceOf(Date);
  });

  it('Should return agreement update date for en-CA locale', () => {
    const agreementUpdateDate = translationsServiceInstance.getTosAgreementUpdatedAt(
      Brand.Dcards, EnCAlocale
    );
    expect(agreementUpdateDate).toBeInstanceOf(Date);
  });

  it('Should return agreement update date for fr-CA locale', () => {
    const agreementUpdateDate = translationsServiceInstance.getTosAgreementUpdatedAt(
      Brand.Dcards, FrCAlocale
    );
    expect(agreementUpdateDate).toBeInstanceOf(Date);
  });
});
