import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CronOrdersRepository } from '../_common/repositories/cron-orders.repository';
import { AppConfigService } from '../_common/services/app-config.service';
import { PdfGenerationService } from '../_common/services/pdf-generation.service';
import { AzureService } from '../_common/services/azure.service';
import { StorageService } from '../_common/services/storage.service';
import { GeneratePdfTask } from './tasks/generate-pdf.task';
import { DeleteObsoleteOrdersTask } from './tasks/delete-obsolete-orders.task';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private pdfGenerationService: PdfGenerationService,
    private schedulerRegistry: SchedulerRegistry,
    private cronOrdersRepository: CronOrdersRepository,
    private appConfigService: AppConfigService,
    private azureService: AzureService,
    private storageService: StorageService
  ) {
    this.setupCronJobs();
  }

  setupCronJobs(): void {
    const {
      cronGeneratePDF,
      cronDeleteObsoleteOrders,
      deleteObsoleteOrdersDays,
      deleteAbandonedOrdersDays
    } = this.appConfigService.cronSchedule;

    try {
      const task = new GeneratePdfTask(
        this.pdfGenerationService,
        this.cronOrdersRepository,
        this.azureService
      );
      const cronJob = new CronJob(cronGeneratePDF, () => {
        this.logger.log('Start pdf generation task.');
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        task.start();
      });
      cronJob.start();
    } catch (err) {
      this.azureService.trackException(err);
    }

    try {
      const task = new DeleteObsoleteOrdersTask(
        this.cronOrdersRepository,
        this.azureService,
        this.storageService
      );
      const cronJob = new CronJob(
        cronDeleteObsoleteOrders,
        () => {
          this.logger.log(`Start obsolete orders deletion task. obsoleteDays = ${deleteObsoleteOrdersDays}, abandonedDays=${deleteAbandonedOrdersDays}`);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          task.start(
            deleteObsoleteOrdersDays,
            deleteAbandonedOrdersDays
          );
        }
      );
      cronJob.start();
    } catch (err) {
      this.azureService.trackException(err);
    }
  }
}
