import { Injectable } from '@nestjs/common';
import * as PDFDocumentKit from 'pdfkit';
import * as getStream from 'get-stream';
import * as intoStream from 'into-stream';
import { Order } from 'src/_common/entities/order.entity';
import { Card } from 'src/_common/types/card.type';
import { CategoriesRepository } from '../repositories/categories.repository';
import { StorageService } from './storage.service';
import { AppConfigService } from './app-config.service';
import { EmojiService } from './emoji.service';
import { PdfData } from '../../pdf/types/pdf-data.type';
import { PdfRequestDto } from '../../pdf/dto/pdf-request.dto';
import { Print } from '../../pdf/enums/print.enum';
import { PrintEvent } from '../../pdf/types/print-event.type';
import { PrintAttemptDelta, PrintSuccessDelta } from '../../pdf/types/update-delta.type';
import { LegacyEmojiService } from './emoji-legacy.service';
import { AssetsService } from './assets.service';
import { AssetType } from '../enums/asset-type.enum';
import { Brand } from '../enums/brand.enum';

type TextareaProps = {
  top: number;
  height: number;
};

@Injectable()
export class PdfGenerationService {
  constructor(
    private emojiService: EmojiService,
    private legacyEmojiService: LegacyEmojiService,
    private storageService: StorageService,
    private appConfigService: AppConfigService,
    private categoriesRepository: CategoriesRepository,
    private assetsService: AssetsService
  ) {}

  async generateBasePDFLayout(pdfData: PdfData): Promise<Buffer> {
    // 1 pdfKit point == ~0.3527mm == 0.01388 inches
    const PAGE_WIDTH = 792;
    const PAGE_HEIGHT = 612;
    const MARGIN = 15;
    const doc = new PDFDocumentKit({ size: [PAGE_WIDTH, PAGE_HEIGHT] });
    const customImageId = pdfData.id;
    const isCustomPhoto = pdfData.attributes.includes('overlay') || pdfData.attributes.includes('photo');
    const textAreaTopOffset = (pdfData.textareaTop / 300) * 72;
    const textAreaHeight = (pdfData.textareaHeight / 300) * 72;
    const backCoverImagePath = (): string => {
      switch (pdfData.brand) {
        case Brand.Dcards:
        default:
          return './assets/common/back_1650x2550.png';
      }
    };

    const bufferedBackLogoImage = await this.assetsService.getCachedLocalAsset(
      backCoverImagePath()
    );

    const frontImage = this.appConfigService.featureStatuses.cloudinaryEnabled ? `${pdfData.cardId}_front.png` : `i/${pdfData.cardId}_print_front.png`;
    const insideImage = this.appConfigService.featureStatuses.cloudinaryEnabled ? `${pdfData.cardId}_inside.png` : `i/${pdfData.cardId}_print_inside.png`;

    const bufferedFrontCoverImage = await this
      .getFrontCoverImageBuffer(isCustomPhoto, frontImage, customImageId, pdfData.brand);

    let bufferedInsideImage;
    try {
      bufferedInsideImage = await this.assetsService.getCachedAsset(
        pdfData.brand,
        insideImage,
        AssetType.print
      );
    } catch {
      bufferedInsideImage = undefined;
    }

    const bufferedMainFontFile = await this.assetsService.getCachedLocalAsset(`./assets/font/${pdfData.fontFamily.replace(/\s/g, '')}.ttf`);
    const bufferedEAOrderNumberFile = await this.assetsService.getCachedLocalAsset('./assets/font/DejaVuSans.ttf');

    // Main text size measurement
    doc.font(bufferedMainFontFile).fontSize(Number(pdfData.fontSize));
    // Add back cover image
    doc.rotate(
      this.appConfigService.pdfConfig.portrait.outsideBack.rotation.angle,
      this.appConfigService.pdfConfig.portrait.outsideBack.rotation.options
    );
    doc.image(
      bufferedBackLogoImage,
      this.appConfigService.pdfConfig.portrait.outsideBack.x,
      this.appConfigService.pdfConfig.portrait.outsideBack.y,
      this.appConfigService.pdfConfig.portrait.outsideBack.options
    );
    // Add front cover image
    doc.rotate(
      this.appConfigService.pdfConfig.portrait.outsideFront.rotation.angle,
      this.appConfigService.pdfConfig.portrait.outsideFront.rotation.options
    );
    doc.image(
      bufferedFrontCoverImage,
      this.appConfigService.pdfConfig.portrait.outsideFront.x,
      this.appConfigService.pdfConfig.portrait.outsideFront.y,
      this.appConfigService.pdfConfig.portrait.outsideFront.options
    );

    // Add shop uniqe identifier

    // 'FIT' NEED TO CHECK ON PDF GEN
    doc
      .fillColor('grey', 0.7)
      .font(bufferedEAOrderNumberFile)
      .fontSize(11)
      .text(pdfData.orderNumber, 150, 490, {
        align: 'left',
        baseline: 'top'
        // fit: [PAGE_WIDTH, PAGE_HEIGHT]
      });

    // Add second (inner) page
    doc.addPage({
      layout: 'landscape',
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    });

    doc.image(
      bufferedInsideImage, 0, 0, this.appConfigService.pdfConfig.portrait.insidePrimary.options
    );

    if (pdfData.uiVersion && this.appConfigService.uiPdfGenStartVersion
      && parseFloat(pdfData.uiVersion) >= parseFloat(this.appConfigService.uiPdfGenStartVersion)) {
      this.emojiService.emoji(
        doc,
        pdfData.text,
        PAGE_WIDTH / 2 + MARGIN,
        pdfData.id,
        textAreaTopOffset + (textAreaHeight / 2),
        textAreaHeight,
        pdfData.fontSize,
        bufferedMainFontFile,
        false
      );
    } else {
      this.legacyEmojiService.emoji(
        doc,
        pdfData.text,
        PAGE_WIDTH / 2 + MARGIN,
        pdfData.id,
        textAreaTopOffset + (textAreaHeight / 2),
        textAreaHeight,
        pdfData.fontSize,
        bufferedMainFontFile,
        false
      );
    }

    doc.save();
    doc.restore();
    doc.end();
    return getStream.buffer(doc);
  }

  private async getFrontCoverImageBuffer(
    isCustomPhoto: boolean,
    cardId: string,
    customImageId: string,
    brand: Brand
  ) {
    if (isCustomPhoto) {
      return this.storageService.downloadBlobBuffer(
        this.appConfigService.storageConfig.customImagesContainerName,
        customImageId
      );
    }
    return this.assetsService.getCachedAsset(brand, cardId, AssetType.print);
  }

  async generatePdf(pdfData: PdfData): Promise<string> {
    const pdf = await this.generateBasePDFLayout(pdfData);
    return this.uploadPdfToBlob(pdfData.id, pdf);
  }

  private async uploadPdfToBlob(
    printibleId: string,
    file: Buffer
  ): Promise<string> {
    const stream = intoStream(file);
    await this.storageService.uploadFileToStorageService(
      stream,
      this.appConfigService.storageConfig.pdfContainerName,
      printibleId
    );
    return this.storageService.generateSecuredUri(
      printibleId,
      this.appConfigService.storageConfig.pdfContainerName
    );
  }

  generateUpdateDelta(
    foundOrder: Order,
    printDto: PdfRequestDto,
    updateType = Print.Attempt,
    clientIp?: string,
    apiVersion?: string
  ): PrintAttemptDelta | PrintSuccessDelta {
    const newPrintEvent: PrintEvent = {
      employee_id: printDto.employee_id,
      store_number: printDto.store_number,
      time: new Date(),
      client_ip: clientIp,
      api_version: apiVersion
    };

    if (updateType === Print.Attempt) {
      return {
        print_attempts_count: foundOrder.print_attempts_count + 1,
        last_print_attempt_date: new Date(),
        ea_order_number: printDto.ea_order_number,
        print_attempts: [...foundOrder.print_attempts, newPrintEvent]
      };
    }
    return {
      print_successes_count: foundOrder.print_successes_count + 1,
      last_print_success_date: new Date(),
      ea_order_number: printDto.ea_order_number,
      print_successes: [...foundOrder.print_successes, newPrintEvent]
    };
  }

  private getTextareaProps(card: Card): TextareaProps {
    const defaultPadding = 72; // px is 2.8% pdfKitUnit
    const fullPageHeight = 2550; // px (8.5" * 300dpi)

    const top = (card.textarea_offset && card.textarea_offset.top)
      ? card.textarea_offset.top : 0;
    const bottom = (card.textarea_offset && card.textarea_offset.bottom)
      ? card.textarea_offset.bottom : 0;
    const height = fullPageHeight - (top + bottom + (defaultPadding * 2));

    return {
      top: top + defaultPadding,
      height
    };
  }

  async preparePdfData(foundOrder: Order, pdfRequestDto: PdfRequestDto): Promise<PdfData> {
    const cardDefinition = await this.categoriesRepository.getCard(
      foundOrder.definition_id, foundOrder.brand
    );
    const textareaProps: TextareaProps = this.getTextareaProps(cardDefinition);

    return {
      id: foundOrder._id.toString(),
      text: foundOrder.customer_text,
      fontFamily: cardDefinition.font.family,
      fontSize: cardDefinition.font.size,
      fontColor: cardDefinition.font.color,
      cardId: cardDefinition.id,
      layout: cardDefinition.type,
      orderNumber: pdfRequestDto.ea_order_number || foundOrder.ea_order_number || '',
      create_date: foundOrder.create_date,
      attributes: cardDefinition.attributes,
      textareaTop: textareaProps.top,
      textareaHeight: textareaProps.height,
      uiVersion: foundOrder.ui_version,
      brand: foundOrder.brand || Brand.Dcards
    };
  }
}
