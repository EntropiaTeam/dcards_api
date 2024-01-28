/* eslint-disable no-await-in-loop */
import { PdfGenerationService } from '../../_common/services/pdf-generation.service';
import { CronOrdersRepository } from '../../_common/repositories/cron-orders.repository';
import { AzureService } from '../../_common/services/azure.service';
import { Order } from '../../_common/entities/order.entity';

export class GeneratePdfTask {
  private _triggered = false;

  constructor(
    private pdfGenerationService: PdfGenerationService,
    private cronOrdersRepository: CronOrdersRepository,
    private azureService: AzureService
  ) {}

  async start(): Promise<void> {
    try {
      if (this._triggered) return;
      this._triggered = true;

      await this.generatePdfForNonPrintedOrders();
    } catch (err) {
      this.azureService.trackException(err);
    } finally {
      this._triggered = false;
    }
  }

  async generatePdfForNonPrintedOrders(): Promise<void> {
    const ordersToPrint = await this.cronOrdersRepository.findNotPrintedOrders();
    let iterationPrint = 0;

    for (let i = 0; i < ordersToPrint.length; i += 1) {
      const order = ordersToPrint[i];
      try {
        await this.generatePdf(order);
        iterationPrint += 1;
      } catch (err) {
        this.azureService.trackException(err);
      }
    }
    if (iterationPrint > 0) {
      this.azureService.trackMetric('print success', iterationPrint);
    }
    if (ordersToPrint.length - iterationPrint) {
      this.azureService.trackMetric('print failed', ordersToPrint.length - iterationPrint);
    }
  }

  async generatePdf(foundOrder: Order): Promise<void> {
    const printDto = {
      store_number: '0000',
      employee_id: 'cron',
      ea_order_number: foundOrder.ea_order_number ?? ''
    };

    const pdfData = await this.pdfGenerationService.preparePdfData(foundOrder, printDto);
    await this.pdfGenerationService.generatePdf(pdfData);

    await this.cronOrdersRepository.addPrintAttemptEvent(
      foundOrder._id,
      printDto.ea_order_number,
      {
        employee_id: printDto.employee_id,
        store_number: printDto.store_number,
        time: new Date()
      }
    );
  }
}
