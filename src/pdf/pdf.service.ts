import { Injectable, Logger } from '@nestjs/common';
import { Order } from '../_common/entities/order.entity';
import { OrderRequestDto } from '../order/dto/order-request.dto';
import { Brand } from '../_common/enums/brand.enum';
import { OrdersRepository } from '../_common/repositories/orders.repository';
import { StorageService } from '../_common/services/storage.service';
import { PdfGenerationService } from '../_common/services/pdf-generation.service';
import { PdfRequestDto } from './dto/pdf-request.dto';
import { PdfAttemptResponseDto } from './dto/pdf-attempt-response.dto';
import { PdfSuccessResponseDto } from './dto/pdf-success-response.dto';
import { Print } from './enums/print.enum';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  constructor(
    private ordersRepository: OrdersRepository,
    private storageService: StorageService,
    private pdfGenerationService: PdfGenerationService
  ) {}

  async create(
    pdfRequestDto: PdfRequestDto, printibleId: string, clientIp?: string
  ): Promise<PdfAttemptResponseDto> {
    this.logger.log(`Start create pdf. order id = ${printibleId}`);
    const apiVersion = process.env.APP_VERSION;
    let securedUrl: string;
    let order: Order;
    const INCIDENT_KEY = '05122021_incident';
    try {
      securedUrl = await this.getPdfUrl(pdfRequestDto, printibleId);
      order = await this.ordersRepository.findOrder(printibleId);
      if (order.referrer_url === INCIDENT_KEY) {
        throw new Error();
      }
    } catch (error) {
      const orderRequestDto: OrderRequestDto = {
        cardID: INCIDENT_KEY,
        text: INCIDENT_KEY
      };
      securedUrl = await this.getPdfUrlWithoutOrder(printibleId);
      order = await this.ordersRepository.createWithId(
        printibleId, orderRequestDto, INCIDENT_KEY, 'uiVersion', null, Brand.Dcards, undefined, clientIp
      );
    }

    const updateDelta = this.pdfGenerationService.generateUpdateDelta(
      order,
      pdfRequestDto,
      Print.Attempt,
      clientIp,
      apiVersion
    );
    this.logger.log(`Start update order. order id = ${printibleId}`);
    await this.ordersRepository.updateWith(updateDelta, printibleId);

    const pdfAttemptResponse = new PdfAttemptResponseDto();
    pdfAttemptResponse.data = {
      pdf_id: printibleId,
      pdf_url: securedUrl
    };

    return pdfAttemptResponse;
  }

  async update(
    printRequestDto: PdfRequestDto, printibleId: string, clientIp?: string
  ): Promise<PdfSuccessResponseDto> {
    const order = await this.ordersRepository.findOrder(printibleId);
    const updateDelta = this.pdfGenerationService.generateUpdateDelta(
      order,
      printRequestDto,
      Print.Success,
      clientIp
    );
    const updatedOrder = await this.ordersRepository.updateWith(updateDelta, printibleId);
    const pdfSuccessResponse = new PdfSuccessResponseDto();
    pdfSuccessResponse.data = {
      updatedOrder: { ...updatedOrder }
    };

    return pdfSuccessResponse;
  }

  async getPdfUrl(pdfRequestDto:PdfRequestDto, printibleId:string):Promise<string> {
    const order = await this.ordersRepository.findOrder(printibleId);

    let securedUrl = '';
    if (order.ea_order_number === pdfRequestDto.ea_order_number) {
      securedUrl = await this.storageService.getPdfBlobUrl(printibleId);
    }

    if (!securedUrl.length) {
      const pdfData = await this.pdfGenerationService.preparePdfData(order, pdfRequestDto);
      securedUrl = await this.pdfGenerationService.generatePdf(pdfData);
    }

    return securedUrl;
  }

  async getPdfUrlWithoutOrder(printibleId:string):Promise<string> {
    const securedUrl = await this.storageService.getPdfBlobUrl(printibleId);

    return securedUrl;
  }
}
