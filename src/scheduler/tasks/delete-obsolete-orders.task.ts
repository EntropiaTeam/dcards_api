/* eslint-disable no-await-in-loop, no-constant-condition */
import { ObjectId } from 'mongodb';
import { CronOrdersRepository } from '../../_common/repositories/cron-orders.repository';
import { AzureService } from '../../_common/services/azure.service';
import { StorageService } from '../../_common/services/storage.service';

const EV_NAME = 'delete_obsolete_orders';

export class DeleteObsoleteOrdersTask {
  private _triggered = false;

  constructor(
    private cronOrdersRepository: CronOrdersRepository,
    private azureService: AzureService,
    private storageService: StorageService
  ) {}

  async start(obsoleteDays: number, abandonedDays: number): Promise<void> {
    try {
      if (this._triggered) return;
      this._triggered = true;

      await this.deleteObsoleteOrders(obsoleteDays, abandonedDays);
    } catch (err) {
      this.azureService.trackException(err);
    } finally {
      this._triggered = false;
    }
  }

  async deleteObsoleteOrders(
    obsoleteDays: number,
    abandonedDays: number
  ): Promise<void> {
    const bulkSize = 5;
    let deleteOrdIds: ObjectId[] = [];

    const obsoletedOrders = await this.cronOrdersRepository
      .findObsoleteOrderIds(obsoleteDays, abandonedDays);

    for (let i = 0; i < obsoletedOrders.length; i += 1) {
      const orderId = obsoletedOrders[i];
      try {
        await this.storageService.deleteOrderBlobs(orderId.toHexString());
        deleteOrdIds.push(orderId);

        if (deleteOrdIds.length > bulkSize) {
          const ids = deleteOrdIds;
          deleteOrdIds = [];
          await this.cronOrdersRepository.deleteOrdersById(ids, true);
          ids.forEach((id) => this.track(id.toHexString(), true));
        }
      } catch (err) {
        this.azureService.trackException(err);
        this.track(orderId.toHexString(), false);
      }
    }

    if (deleteOrdIds.length > 0) {
      try {
        await this.cronOrdersRepository.deleteOrdersById(deleteOrdIds, true);
        deleteOrdIds.forEach((id) => this.track(id.toHexString(), true));
      } catch (err) {
        this.azureService.trackException(err);
        deleteOrdIds.forEach((id) => this.track(id.toHexString(), false));
      }
    }
  }

  private track(orderId: string, ok: boolean): void {
    this.azureService.trackEvent({ name: EV_NAME, properties: { orderId, ok } });
  }
}
