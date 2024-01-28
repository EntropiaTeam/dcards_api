import { Card } from './card.type';

type Category = {
  id: string;
  name: string;
  sequence: number;
  culture_names: {
    [key: string]: string;
  }[];
  occasion_maps: {
    [key: string]: number[];
  };
  preview_cards: string[];
  cards: Card[];
  start_date: string;
  end_date: string;
};

type CategoryResponse = {
  categories: Category[];
  assetsUrl: string;
};

export {
  Category, CategoryResponse
};
