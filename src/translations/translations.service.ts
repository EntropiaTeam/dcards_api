import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CacheService } from '../_common/services/cache.service';
import { TranslationsResponseDto } from './dto/translations-responce.dto';
import {
  Agreement, TranslationCache, UpdatedAtDate
} from '../_common/types/translations.type';
import { Locale } from '../_common/types/locale.type';
import { BrandType } from '../_common/enums/brand.enum';

@Injectable()
export class TranslationsService {
  constructor(private cacheService: CacheService) {}

  static TOS_AGREEMENT_CACHE_KEY = 'tos_agreement_i18n';

  static TRANSLATIONS_DIR = path.resolve(process.cwd(), 'assets/translations');

  static TOS_AGREEMENT_FILE = 'tos_agreement.json';

  getTosAgreement(
    brand: BrandType, locale: Locale, invalidateCache?: boolean
  ): TranslationsResponseDto<Agreement> {
    const cachedAgreement = this.getCache<TranslationCache<Agreement>>(
      TranslationsService.TOS_AGREEMENT_CACHE_KEY
    );

    if (cachedAgreement && !invalidateCache) {
      return { data: cachedAgreement[brand][locale] };
    }

    const agreementToCache: TranslationCache<Agreement> = this.parseJson(
      `${TranslationsService.TRANSLATIONS_DIR}/${TranslationsService.TOS_AGREEMENT_FILE}`
    );

    this.cacheService.setCache(TranslationsService.TOS_AGREEMENT_CACHE_KEY, agreementToCache);

    return { data: agreementToCache[brand][locale] };
  }

  getTosAgreementUpdatedAt(brand: BrandType, locale: Locale): Date {
    let updatedAt: Date;
    const cachedAgreement = this.getCache<TranslationCache<Agreement>>(
      TranslationsService.TOS_AGREEMENT_CACHE_KEY
    );

    if (cachedAgreement) {
      const updatedAtDateObject = cachedAgreement[brand][locale].agreement.updateDate;
      updatedAt = this.getDateFromAgreement(updatedAtDateObject);
    } else {
      const parsedFromFileAgreement = this.parseJson(`${TranslationsService.TRANSLATIONS_DIR}/${TranslationsService.TOS_AGREEMENT_FILE}`);
      const updatedAtDateObject = parsedFromFileAgreement[brand][locale].agreement.updateDate;
      updatedAt = this.getDateFromAgreement(updatedAtDateObject);
    }

    this.validateDate(updatedAt, locale);

    return updatedAt;
  }

  private parseJson(filePath: string): TranslationCache<Agreement> {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as TranslationCache<Agreement>;
  }

  private getCache<T>(key: string) {
    return this.cacheService.getCache<T>(key);
  }

  private validateDate(date: Date, locale: Locale): boolean {
    const valueToValidate = date.getTime();

    if (Number.isNaN(valueToValidate) || !valueToValidate || valueToValidate < 0) {
      const errorMessage = new Error(`Invalid Date provided while processing translations. \nlocale: ${locale}`);
      throw new InternalServerErrorException(errorMessage);
    }

    return true;
  }

  private getDateFromAgreement = (updatedAtObject: UpdatedAtDate) => {
    const { year, month, day } = updatedAtObject;
    return new Date(year, month - 1, day);
  };
}
