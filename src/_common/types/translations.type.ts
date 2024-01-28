import { BrandType } from '../enums/brand.enum';
import { Locale } from './locale.type';

type Agreement = {
  agreement: {
    title: string;
    subTitle: string;
    updateDateTitle: string;
    updateDate: UpdatedAtDate;
    tos: string;
  };
};

type UpdatedAtDate = {
  day: number;
  month: number;
  year: number;
};

type TranslationCache<T> = {
  [brand in BrandType]: {
    [key in Locale]: T;
  };
};

export {
  Agreement,
  TranslationCache,
  UpdatedAtDate
};
