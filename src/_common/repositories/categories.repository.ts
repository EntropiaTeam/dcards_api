import { Injectable, NotFoundException } from '@nestjs/common';
import { Card } from '../types/card.type';
import { CacheService } from '../services/cache.service';
import { AppConfigService } from '../services/app-config.service';
import { SimpleHttpService } from '../services/simple-http.service';
import { Brand } from '../enums/brand.enum';

@Injectable()
export class CategoriesRepository {
  constructor(private cacheService: CacheService,
    private appConfigService: AppConfigService,
    private simpleHttpService: SimpleHttpService) {}

  async getData<T>(invalidateCache: boolean, name: string, brand: Brand): Promise<T> {
    let data = this.cacheService.getCache<T>(name + brand);
    if (!invalidateCache && data) {
      return data;
    }
    const url = this.appConfigService.assetsConfig[brand][name];

    data = await this.simpleHttpService.getData<T>(url);
    this.cacheService.setCache(name + brand, data);
    return data;
  }

  async getCard(definitionId:string, brand: Brand):Promise<Card> {
    const cards = await this.getData<Card[]>(false, 'cards', brand);
    const cardDefiniton: Card | undefined = cards.find((card: Card) => card.id === definitionId);

    if (!cardDefiniton) {
      throw new NotFoundException({ message: `There is no card with ID ${definitionId}` });
    }

    return cardDefiniton;
  }
}
