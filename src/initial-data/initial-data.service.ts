import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../_common/repositories/categories.repository';
import { Category } from '../_common/types/category.type';
import { Card } from '../_common/types/card.type';
import { AppConfigService } from '../_common/services/app-config.service';
import { TranslationsService } from '../translations/translations.service';
import { InitialDataResponseDto } from './dto/initial-data-response.dto';
import { Locale } from '../_common/types/locale.type';
import { BrandType } from '../_common/enums/brand.enum';

@Injectable()
export class InitialDataService {
  constructor(
    private translationsService: TranslationsService,
    private appConfigService: AppConfigService,
    private categoriesRepository: CategoriesRepository
  ) {}

  async getInitialData(
    invalidateCache: boolean,
    brand: BrandType,
    locale: Locale,
    hidePhotoCards: boolean
  ): Promise<InitialDataResponseDto> {
    const allCategories = await this.categoriesRepository.getData<Category[]>(invalidateCache, 'categories', brand);
    const allCards = await this.categoriesRepository.getData<Card[]>(invalidateCache, 'cards', brand);
    const categories = this.filterCategoriesByCulture(
      allCards,
      allCategories,
      locale,
      hidePhotoCards
    );

    const agreement = this.translationsService.getTosAgreement(
      brand,
      locale,
      invalidateCache
    );

    const cloudinaryFeatureFlag = this.appConfigService.featureStatuses.cloudinaryEnabled;

    return {
      data: {
        categories,
        tosAgreement: agreement.data,
        cloudinaryFeatureFlag
      }
    };
  }

  private filterCategoriesByCulture(
    cards: Card[],
    categories: Category[],
    locale: string,
    hidePhotoCards: boolean
  ): Category[] {
    const isCustomCardsEnabled = this.appConfigService.featureStatuses.photoCardsEnabled;
    const isOverlayCardsEnabled = this.appConfigService.featureStatuses.overlayCardsEnabled;
    let filteredCategories: Category[] = categories.map((category) => ({
      ...(!category.preview_cards ? { preview_cards: [] } : {}),
      ...category,
      cards: []
    }));

    let filteredCards = cards;
    if (!isOverlayCardsEnabled || (isCustomCardsEnabled && hidePhotoCards)) {
      filteredCards = filteredCards.filter((card) => !card.attributes.includes('overlay'));
    }

    if (!isCustomCardsEnabled || (isCustomCardsEnabled && hidePhotoCards)) {
      filteredCards = filteredCards.filter((card) => !card.attributes.includes('photo'));
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const category of filteredCategories) {
      category.culture_names.forEach((culture_name) => {
        if (Object.keys(culture_name)[0] === locale) {
          category.name = culture_name[locale];
        }
      });
      // eslint-disable-next-line no-restricted-syntax
      for (const card of filteredCards) {
        if (card.culture.includes(locale) && card.category.includes(category.id)) {
          category.cards.push(card);
        }
      }
    }

    filteredCategories = filteredCategories
      .filter((category) => {
        let startDateIsCurrent = true;
        let endDateIsCurrent = true;
        if (category.start_date) {
          startDateIsCurrent = (Date.parse(category.start_date) <= Date.now());
        }
        if (category.end_date) {
          endDateIsCurrent = (Date.parse(category.end_date) >= Date.now());
        }
        return startDateIsCurrent && endDateIsCurrent;
      });

    filteredCategories = filteredCategories
      .filter((category) => category !== undefined && category.cards.length);

    if (!isCustomCardsEnabled || (isCustomCardsEnabled && hidePhotoCards)) {
      filteredCategories = filteredCategories.filter((category) => category.id !== 'custom_photo');
    }

    return filteredCategories;
  }
}
