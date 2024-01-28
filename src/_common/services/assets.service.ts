import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { SimpleHttpService } from './simple-http.service';
import { AppConfigService } from './app-config.service';
import { AssetType } from '../enums/asset-type.enum';
import { CacheService } from './cache.service';
import { StorageService } from './storage.service';
import { Brand } from '../enums/brand.enum';

@Injectable()
export class AssetsService {
  constructor(
    private appConfigService: AppConfigService,
    private simpleHttpService: SimpleHttpService,
    private storageService: StorageService,
    private cacheService: CacheService
  ) {}

  async getCachedAsset(
    brand: Brand,
    fileName: string,
    fileType: AssetType,
    invalidateCache = false
  ): Promise<Buffer> {
    let fileBuffer: Buffer;
    const { storageConfig, featureStatuses, assetsConfig } = this.appConfigService;
    let fileUrl = `${assetsConfig[fileType]}/${fileName}`;

    if (assetsConfig[brand][fileType]) {
      fileUrl = `${assetsConfig[brand][fileType]}/${fileName}`;
    }

    if (!featureStatuses.cloudinaryEnabled) {
      fileUrl = this.storageService.getBlobUrl(storageConfig.cardAssetsContainerName, fileName);
    }

    const data = this.cacheService.getCache<Buffer>(fileUrl);
    if (!invalidateCache && data) return data;

    if (featureStatuses.cloudinaryEnabled) {
      fileBuffer = await this.simpleHttpService.getDataAsBuffer<Buffer>(fileUrl);
    } else {
      fileBuffer = await this.storageService.downloadBlobBuffer(
        storageConfig.cardAssetsContainerName,
        fileName
      );
    }

    this.cacheService.setCache(fileUrl, fileBuffer);
    return fileBuffer;
  }

  async getCachedLocalAsset(fileName: string): Promise<Buffer> {
    const data = this.cacheService.getCache<Buffer>(fileName);
    if (data) return data;
    const fileBuffer: Buffer = await new Promise((resolve, reject) => {
      fs.readFile(fileName, (err, buf) => {
        if (err) reject(err);
        else resolve(buf);
      });
    });
    this.cacheService.setCache(fileName, fileBuffer);
    return fileBuffer;
  }
}
