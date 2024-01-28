import { Injectable, BadRequestException } from '@nestjs/common';
import { fromBuffer } from 'file-type';
import { ObjectId } from 'mongodb';
import * as intoStream from 'into-stream';
import Jimp from 'jimp/es';
import { Brand } from '../_common/enums/brand.enum';
import { File } from '../_common/types/file.type';
import { StorageService } from '../_common/services/storage.service';
import { AppConfigService } from '../_common/services/app-config.service';
import { AssetsService } from '../_common/services/assets.service';
import { TranslationsService } from '../translations/translations.service';
import { CategoriesRepository } from '../_common/repositories/categories.repository';
import { OrdersRepository } from '../_common/repositories/orders.repository';
import { OrderUpdateResponseDto } from './dto/order-update-response.dto';
import { OrderUpdateRequestDto } from './dto/order-update-request.dto';
import { OrderRequestDto } from './dto/order-request.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { AssetType } from '../_common/enums/asset-type.enum';

const PREVIEW_WIDTH = 126;
const PREVIEW_HEIGHT = 200;
const MEDIUM_PREVIEW_WIDTH = 238;
const MEDIUM_PREVIEW_HEIGHT = 383;

@Injectable()
export class OrderService {
  constructor(
    private ordersRepository: OrdersRepository,
    private categoriesRepository: CategoriesRepository,
    private appConfigService: AppConfigService,
    private storageService: StorageService,
    private translationsService: TranslationsService,
    private assetsService: AssetsService
  ) {}

  async create(
    orderRequestDto: OrderRequestDto,
    referrer: string,
    uiVersion: string,
    userAgent?: string,
    file?: File,
    clientIp?: string
  ): Promise<OrderResponseDto> {
    let previewUri = '';
    let mediumPreviewUri = '';
    let tosUpdateDate: Date | null = null;
    const brand = Brand.Dcards;

    if (file && !orderRequestDto.tosAgreed) {
      throw new BadRequestException(`"tosAgreed" should be set to "true" when creating order with custom photo.
      \ncurrent "tosAgreed" value: ${JSON.stringify(orderRequestDto.tosAgreed)} `);
    }

    if (file) {
      await this.validatePhotoFile(file);
    }

    if (orderRequestDto.tosAgreed && orderRequestDto.locale) {
      tosUpdateDate = this.translationsService.getTosAgreementUpdatedAt(
        brand, orderRequestDto.locale
      );
    }

    const order = await this.ordersRepository.create(
      orderRequestDto, referrer, uiVersion, tosUpdateDate, brand, userAgent, clientIp
    );

    if (file) {
      await this.mergeOverlayAndUpload(file, orderRequestDto.cardID, order._id, brand);
      previewUri = this.generatePreviewSecureUri(`${order._id.toString()}_thumb_front`);
      mediumPreviewUri = this.generatePreviewSecureUri(`${order._id.toString()}_medium_thumb_front`);
    } else {
      previewUri = `${this.appConfigService.assetsConfig[AssetType.thumbnail]}/${orderRequestDto.cardID}_front.png`;
      mediumPreviewUri = `${this.appConfigService.assetsConfig[AssetType.mediumThumbnail]}/${orderRequestDto.cardID}_front.png`;
      if (!this.appConfigService.featureStatuses.cloudinaryEnabled) {
        previewUri = this.getPreviewBlobUrl(`${orderRequestDto.cardID}_thumb_front.png`);
        mediumPreviewUri = this.getPreviewBlobUrl(`${orderRequestDto.cardID}_medium_thumb_front.png`);
      }
    }

    return {
      data: {
        printibleID: order._id.toString(),
        previewUri,
        mediumPreviewUri
      }
    };
  }

  private getPreviewBlobUrl(fileName: string): string {
    return this.storageService.getBlobUrl(
      this.appConfigService.storageConfig.cardAssetsContainerName,
      `i/${fileName}`
    );
  }

  private generatePreviewSecureUri(fileName: string): string {
    return this.storageService.generateSecuredUri(
      fileName,
      this.appConfigService.storageConfig.customImagesContainerName
    );
  }

  private async validatePhotoFile(file: File): Promise<void> {
    const fileData = await fromBuffer(file.buffer);

    if (fileData && fileData.ext !== 'jpg') {
      const errorMessage = `Upload of incorrect format ${fileData.ext} detected`;

      throw new BadRequestException({
        message: errorMessage
      });
    }
  }

  private async mergeOverlayAndUpload(
    file: File,
    cardId: string,
    id: ObjectId,
    brand: Brand
  ): Promise<void> {
    let uploadBuffer: Buffer;
    const cardDefinition = await this.categoriesRepository.getCard(cardId, brand);

    if (cardDefinition.attributes.includes('overlay')) {
      uploadBuffer = await this.mergeOverlay(file, cardId, brand);
    } else {
      uploadBuffer = file.buffer;
    }

    await this.uploadPhoto(uploadBuffer, id);
  }

  private async mergeOverlay(file: File, cardId: string, brand: Brand) {
    const cardFile = this.appConfigService.featureStatuses.cloudinaryEnabled ? `${cardId}_front.png` : `${cardId}_print_front.png`;
    const bufferedFrontCoverImage = await this.assetsService.getCachedAsset(
      brand,
      cardFile,
      AssetType.print
    );

    const overlayImage = await Jimp.read(bufferedFrontCoverImage).catch(() => {
      const errorMessage = 'Error occurred during reading catalog asset file';

      throw new BadRequestException({
        message: errorMessage
      });
    });
    const croppedImage: Jimp = await Jimp.read(file.buffer).catch(() => {
      const errorMessage = `Error occurred during reading image with type ${file.mimetype} and buffer ${file.buffer.toString()} in merge operation`;

      throw new BadRequestException({
        message: errorMessage
      });
    });
    const imageWithOverlayBuffer = croppedImage.composite(overlayImage, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 1
    });
    return imageWithOverlayBuffer.getBufferAsync('image/jpeg');
  }

  private async uploadPhoto(fileBuffer: Buffer, id: ObjectId): Promise<void> {
    const imageBuffer: Buffer = fileBuffer;
    const [previewImageBuffer, mediumPreviewImageBuffer] = await Promise.all([
      this.resizeImage(imageBuffer, PREVIEW_WIDTH, PREVIEW_HEIGHT),
      this.resizeImage(imageBuffer, MEDIUM_PREVIEW_WIDTH, MEDIUM_PREVIEW_HEIGHT)
    ]);

    await Promise.all([
      this.uploadCustomImageToBlob(imageBuffer, `${id.toString()}`),
      this.uploadCustomImageToBlob(previewImageBuffer, `${id.toString()}_thumb_front`),
      this.uploadCustomImageToBlob(mediumPreviewImageBuffer, `${id.toString()}_medium_thumb_front`)
    ]);
  }

  private resizeImage(imageBuffer: Buffer, width: number, height: number): Promise<Buffer> {
    return Jimp.read(imageBuffer).then((image) => {
      image.resize(width, height);
      return image.getBufferAsync('image/jpeg');
    }).catch(() => {
      const errorMessage = `Error occurred during reading image buffer ${imageBuffer.buffer.toString()} in upload operation`;

      throw new BadRequestException({
        message: errorMessage
      });
    });
  }

  private async uploadCustomImageToBlob(
    bufferedFile: Buffer,
    fileName: string
  ): Promise<void> {
    const imageStream = intoStream(bufferedFile);
    await this.storageService.uploadFileToStorageService(
      imageStream,
      this.appConfigService.storageConfig.customImagesContainerName,
      fileName
    );
  }

  async update(
    orderUpdateRequest: OrderUpdateRequestDto, printibleId: string
  ): Promise<OrderUpdateResponseDto> {
    const updatedRequestDto = orderUpdateRequest;
    updatedRequestDto.fulfillment_date = new Date(orderUpdateRequest.fulfillment_date);
    const order = await this.ordersRepository.updateWith<OrderUpdateRequestDto>(
      updatedRequestDto, printibleId
    );
    return {
      data: order,
      message: 'Order Successfully Updated'
    };
  }
}
