import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { MongoRepository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrdersRepository } from './orders.repository';

function buildPivotDate(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

@Injectable()
export class CronOrdersRepository extends OrdersRepository {
  constructor(
    @InjectRepository(Order)
    protected ordersRepository: MongoRepository<Order>
  ) {
    super(ordersRepository);
  }

  findNotPrintedOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      where: {
        print_attempts_count: 0,
        print_successes_count: 0,
        ea_order_number: { $ne: null }
      }
    });
  }

  async findObsoleteOrderIds(obsoleteDays: number, abandonedDays: number): Promise<ObjectId[]> {
    if (obsoleteDays < 14 || obsoleteDays > 360) throw new Error(`Obsolete days out of range 14-360: days = ${obsoleteDays}`);
    if (abandonedDays < 14 || abandonedDays > 360) throw new Error(`Abandoned days out of range 14-360: days = ${abandonedDays}`);

    const obsoleteDate = buildPivotDate(obsoleteDays);
    const abandonedDate = buildPivotDate(abandonedDays);

    const orders = await this.ordersRepository.find({
      where: {
        legal_hold: { $ne: true },
        $or: [
          // paid + fulfilled + obsolete
          {
            fulfillment_date: { $lt: obsoleteDate, $ne: new Date(0) },
            ea_order_number: { $exists: true, $not: { $eq: null } },
            ea_store_number: { $exists: true, $not: { $eq: null } }
          },
          // printed obsolete + paid + not fulfilled
          {
            fulfillment_date: { $not: { $type: 'date' } },
            ea_order_number: { $exists: true, $not: { $eq: null } },
            ea_store_number: { $exists: true, $not: { $eq: null } },
            print_successes_count: { $gt: 0 },
            last_print_success_date: { $lt: obsoleteDate }
          },
          // abandoned
          {
            fulfillment_date: { $not: { $type: 'date' } },
            ea_order_number: null,
            ea_store_number: null,
            print_successes_count: 0,
            last_print_success_date: { $not: { $type: 'date' } },
            create_date: { $lt: abandonedDate }
          }
        ]
      }
    });

    return orders.map((order) => order._id);
  }

  async deleteOrdersById(ids: ObjectId[], strict = false): Promise<number> {
    if (ids.length <= 0) return 0;

    const resp = await this.ordersRepository.deleteMany({ _id: { $in: ids } });

    const deletedIdsNum = resp.result.n ?? resp.deletedCount ?? 0;

    if (strict && deletedIdsNum < ids.length) {
      throw new Error(`Not all orders is deleted. all = ${ids.length}, deleted = ${deletedIdsNum}`);
    }

    return deletedIdsNum;
  }
}
