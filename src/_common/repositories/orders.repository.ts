import {
  NotFoundException, Injectable, Scope, BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { ObjectID, ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm/repository/MongoRepository';
import { Order } from '../entities/order.entity';
import { OrderRequest } from '../types/order-request.type';
import { PrintEvent } from '../entities/print-event.entity';
import { Brand } from '../enums/brand.enum';

@Injectable({ scope: Scope.REQUEST })
export class OrdersRepository {
  protected _order: Order | undefined;

  constructor(
    @InjectRepository(Order)
    protected ordersRepository: MongoRepository<Order>
  ) {}

  setOrder(incomingOrder: Order): void {
    this._order = incomingOrder;
  }

  async findOrder(printible_id: string): Promise<Order> {
    if (!this._order) {
      if (!ObjectId.isValid(printible_id)) {
        throw new BadRequestException({
          message: `No such order. Printible_id: ${printible_id}`
        });
      }
      this._order = await this.ordersRepository.findOne(printible_id);

      if (!this._order) {
        throw new NotFoundException({
          message: `No such order. Printible_id: ${printible_id}`
        });
      }
    }

    return this._order;
  }

  async create(
    orderRequest: OrderRequest,
    referrer: string,
    uiVersion: string,
    tosUpdateDate: Date | null,
    brand: Brand,
    userAgent?: string,
    clientIp?: string
  ): Promise<Order> {
    const newOrderEntity = new Order({
      referrer_url: referrer,
      user_agent: userAgent,
      customer_text: orderRequest.text,
      definition_id: orderRequest.cardID,
      client_ip: clientIp || null,
      tos_agreed: orderRequest.tosAgreed,
      tos_update_date: tosUpdateDate,
      ui_version: uiVersion,
      brand
    });

    return this.ordersRepository.save(newOrderEntity);
  }

  async createWithId(
    id: string,
    orderRequest: OrderRequest,
    referrer: string,
    uiVersion: string,
    tosUpdateDate: Date | null,
    brand: Brand,
    userAgent?: string,
    clientIp?: string
  ): Promise<Order> {
    const newOrderEntity = new Order({
      _id: new ObjectID(id),
      referrer_url: referrer,
      user_agent: userAgent,
      customer_text: orderRequest.text,
      definition_id: orderRequest.cardID,
      client_ip: clientIp || null,
      tos_agreed: orderRequest.tosAgreed,
      tos_update_date: tosUpdateDate,
      ui_version: uiVersion,
      brand
    });

    return this.ordersRepository.save(newOrderEntity);
  }

  async updateWith<T>(
    incomingData: T, printibleId: string
  ): Promise<Order> {
    const order = await this.findOrder(printibleId);
    const dataToUpdate = {
      ...incomingData,
      update_date: new Date()
    };
    return this.ordersRepository.save({
      ...order,
      ...dataToUpdate
    });
  }

  async addPrintSuccessEvent(
    orderId: ObjectId,
    orderNumber: string | undefined,
    event: PrintEvent
  ): Promise<Order> {
    const result = await this.ordersRepository.findOneAndUpdate({ _id: orderId }, {
      $set: {
        last_print_success_date: new Date(),
        ea_order_number: orderNumber
      },
      $inc: { print_successes_count: 1 },
      $push: { print_successes: event }
    });

    if (result.ok) return result.value as Order;
    throw result.lastErrorObject;
  }

  async addPrintAttemptEvent(
    orderId: ObjectId,
    orderNumber: string | undefined,
    event: PrintEvent
  ): Promise<Order> {
    const result = await this.ordersRepository.findOneAndUpdate({ _id: orderId }, {
      $set: {
        last_print_attempt_date: new Date(),
        ea_order_number: orderNumber
      },
      $inc: { print_attempts_count: 1 },
      $push: { print_attempts: event }
    });

    if (result.ok) return result.value as Order;
    throw result.lastErrorObject;
  }
}
