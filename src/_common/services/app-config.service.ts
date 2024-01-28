import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { StorageConfig } from '../types/storage-config.type';
import { FeatureConfig } from '../types/feature-config.type';
import { PdfConfig } from '../types/pdfconfig.type';
import { ExceptionConfig } from '../types/exception-config.type';
import type { AzureTrackConfig } from '../types/azure-track-config.type';
import { SchedulerConfig } from '../types/scheduler-config.type';
import { KeyVaultService } from './key-vault.service';
import { AssetsConfig } from '../types/assets-config.type';
import { Brand } from '../enums/brand.enum';
import { AssetType } from '../enums/asset-type.enum';

@Injectable()
export class AppConfigService {
  private _database!: Partial<MongoConnectionOptions>;

  private _featureStatuses!: FeatureConfig;

  private _storage!: StorageConfig;

  private _cronConfig!: SchedulerConfig;

  private _assetsConfig!: AssetsConfig;

  private _pdfConfig!: PdfConfig;

  private _exceptionConfig!: ExceptionConfig;

  private _azureTrack!: AzureTrackConfig;

  private _uiPdfGenStartVersion: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly keyVaultService: KeyVaultService
  ) {}

  async init(): Promise<void> {
    const nodeEnv = await this.get('NODE_ENV', 'development');
    const storageName = await this.get('STORAGE_ACCOUNT_NAME');
    const storageKey = await this.get('STORAGE_ACCOUNT_ACCESS_KEY');
    const cloudinaryUrl = 'rescloud.ediblearrangements.com/image/private';

    this._storage = {
      name: storageName,
      key: storageKey,
      url: `https://${storageName}.blob.core.windows.net`,
      connectionString: `DefaultEndpointsProtocol=https;AccountName=${storageName};AccountKey=${storageKey}`,
      pdfContainerName: 'pdfs',
      customImagesContainerName: 'custom-images',
      cardAssetsContainerName: 'assets'
    };

    this._assetsConfig = {
      [Brand.Dcards]: {
        cards: `https://${storageName}.blob.core.windows.net/assets/api/card.json`,
        categories: `https://${storageName}.blob.core.windows.net/assets/api/category.json`
      },
      [AssetType.mediumThumbnail]: `https://${storageName}.blob.core.windows.net/blank/medium_thumbnail.webp`,
      [AssetType.thumbnail]: `https://${storageName}.blob.core.windows.net/blank/thumbnail.webp`,
      [AssetType.gallery]: `https://${storageName}.blob.core.windows.net/blank/gallery.webp`,
      [AssetType.editor]: `https://${storageName}.blob.core.windows.net/blank/editor.webp`,
      [AssetType.print]: `https://${storageName}.blob.core.windows.net/blank/Printibles`
      // [AssetType.mediumThumbnail]: `https://${cloudinaryUrl}/f_auto,q_auto,t_thumb_med/Creative-Marketing/Printibles`,
      // [AssetType.thumbnail]: `https://${cloudinaryUrl}/t_thumb,f_auto,q_auto/Creative-Marketing/Printibles`,
      // [AssetType.gallery]: `https://${cloudinaryUrl}/t_gallery,f_auto,q_auto/Creative-Marketing/Printibles`,
      // [AssetType.editor]: `https://${cloudinaryUrl}/t_editor,f_auto,q_auto/Creative-Marketing/Printibles`,
      // [AssetType.print]: `https://${cloudinaryUrl}/t_print/Creative-Marketing/Printibles`
    };

    const dbName = await this.getDbName(nodeEnv);
    this._database = {
      type: 'mongodb',
      port: 10255,
      username: await this.get('COSMOSDB_USER'),
      password: await this.get('COSMOSDB_PASSWORD'),
      database: dbName,
      host: await this.get('COSMOSDB_HOST'),
      j: true,
      ssl: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 40,
      maxPoolSize: 40,
      minPoolSize: 40,
      waitQueueTimeoutMS: 30_000,
      serverSelectionTimeoutMS: 40_000,
      connectTimeoutMS: 30_000,
      socketTimeoutMS: 360_000,
      retryAttempts: 5,
      verboseRetryLog: true
    } as Partial<MongoConnectionOptions>;

    this._featureStatuses = {
      photoCardsEnabled: await this.get('PHOTO_CARDS_ENABLED', '1') === '1',
      overlayCardsEnabled: await this.get('OVERLAY_CARDS_ENABLED', '1') === '1',
      authTokenEnabled: await this.get('AUTH_TOKEN_ENABLED', '0') === '1',
      cloudinaryEnabled: await this.get('CLOUDINARY_FEATURE_FLAG', '0') === '1'
    };
    this._pdfConfig = {
      customImage: {
        maxSize: 10_000_000 // 10 mb in bytes
      },
      landscape: {
        outsideBack: {
          x: 900,
          y: -450,
          options: {
            fit: [400, 333],
            align: 'center',
            valign: 'bottom'
          },
          rotation: {
            angle: 90,
            options: { origin: [0, 0] }
          }
        },
        outsideFront: {
          x: 0,
          y: 0,
          options: {
            fit: [2100, 1500]
          },
          rotation: {
            angle: -90,
            options: { origin: [0, 0] }
          }
        },
        insidePrimary: {
          options: {
            fit: [2100, 1500]
          },
          rotation: {
            angle: -90,
            options: { origin: [1730, 310] }
          }
        }
      },
      portrait: {
        outsideBack: {
          x: 0,
          y: 0,
          options: {
            fit: [792, 612],
            valign: 'center'
          },
          rotation: {
            angle: 0,
            options: { origin: [0, 0] }
          }
        },
        outsideFront: {
          x: 0,
          y: 0,
          options: {
            fit: [792, 612],
            align: 'right'
          },
          rotation: {
            angle: 0,
            options: { origin: [0, 0] }
          }
        },
        insidePrimary: {
          options: {
            fit: [792, 612],
            align: 'right'
          },
          rotation: {
            angle: 0,
            options: { origin: [1730, 310] }
          },
          text: {
            x: 396,
            y: 277
          }
        }
      }
    };

    const deleteObsoleteOrdersDaysValue = await this.get('DELETE_OBSOLETE_ORDERS_DAYS', '90');
    const deleteAbandonedOrdersDaysValue = await this.get('DELETE_ABANDONED_ORDERS_DAYS', '90');

    const deleteObsoleteOrdersDays = Number.parseInt(deleteObsoleteOrdersDaysValue, 10);
    const deleteAbandonedOrdersDays = Number.parseInt(deleteAbandonedOrdersDaysValue, 10);

    if (Number.isNaN(deleteObsoleteOrdersDays)) {
      throw new Error(`Delete obsolete orders days should be a number. days = ${deleteObsoleteOrdersDaysValue}`);
    }
    if (Number.isNaN(deleteAbandonedOrdersDays)) {
      throw new Error(`Delete abandoned orders days should be a number. days = ${deleteAbandonedOrdersDays}`);
    }

    this._cronConfig = {
      cronGeneratePDF: await this.get('CRON_GENERATE_PDF'),
      cronDeleteObsoleteOrders: await this.get('CRON_DELETE_OBSOLETE_ORDERS'),
      deleteObsoleteOrdersDays,
      deleteAbandonedOrdersDays
    };

    this._exceptionConfig = {
      suppressExceptionResponseMessages: await this.get('SUPPRESS_EXCEPTION_RESPONSE_MESSAGES', '1') === '1'
    };

    this._azureTrack = {
      appinsightsInstrumentationkey: await this.get('APPINSIGHTS_INSTRUMENTATIONKEY'),
      trackLocally: await this.get('AZURE_TRACK_LOCALLY') === '1',
      enableRequestsTracking: (await this.get('APPINSIGHTS_ENABLE_REQUESTS_TRACKING')) === 'true'
    };

    this._uiPdfGenStartVersion = await this.get('NEW_PDF_GEN_START_VERSION', '20210204.3');
  }

  private async getDbName(nodeEnv: string) {
    const rawDbName = await this.get('COSMOSDB_DBNAME');
    return ['ci', 'test'].includes(nodeEnv.toLowerCase())
      ? `${rawDbName}-${nodeEnv.toLowerCase()}`
      : rawDbName;
  }

  private async get(key: string, defaultValue = ''): Promise<string> {
    const value = this.configService.get<string>(key);

    if (value) {
      return value;
    }

    const hasDefault = defaultValue !== '';
    const keyVaultKey = key.replace(/_/g, '-');
    const keyVaultSecret = await this.keyVaultService.getSecret(keyVaultKey, hasDefault);

    return keyVaultSecret === undefined ? defaultValue : keyVaultSecret;
  }

  get database(): Partial<MongoConnectionOptions> {
    return this._database;
  }

  get featureStatuses(): FeatureConfig {
    return this._featureStatuses;
  }

  get storageConfig(): StorageConfig {
    return this._storage;
  }

  get cronSchedule(): SchedulerConfig {
    return this._cronConfig;
  }

  get assetsConfig(): AssetsConfig {
    return this._assetsConfig;
  }

  get pdfConfig(): PdfConfig {
    return this._pdfConfig;
  }

  get exceptionConfig(): ExceptionConfig {
    return this._exceptionConfig;
  }

  get azureTrackConfig(): AzureTrackConfig {
    return this._azureTrack;
  }

  get uiPdfGenStartVersion(): string | undefined {
    return this._uiPdfGenStartVersion;
  }
}
