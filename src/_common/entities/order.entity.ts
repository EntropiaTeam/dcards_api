import { ObjectId } from 'mongodb';
import {
  Entity, ObjectIdColumn, Column
} from 'typeorm';
import { Brand } from '../enums/brand.enum';
import { PrintEvent } from './print-event.entity';

@Entity('orders')
export class Order {
  @ObjectIdColumn() _id!: ObjectId;

  @Column() print_attempts!: Array<PrintEvent>;

  @Column() print_successes!: Array<PrintEvent>;

  @Column() definition_id!: string;

  @Column() customer_text!: string;

  @Column() user_agent?: string;

  @Column() ea_order_number!: string | null;

  @Column() create_date!: Date;

  @Column() last_print_attempt_date!: Date | null;

  @Column() last_print_success_date!: Date | null;

  @Column() print_attempts_count!: number;

  @Column() print_successes_count!: number;

  @Column() printible_type!: string;

  @Column() referrer_url!: string;

  @Column() client_ip?: string | null;

  @Column() update_date!: Date;

  @Column() origin_api_version!: string;

  @Column() fulfillment_date!: Date | null;

  @Column() ea_store_number!: string | null;

  @Column() tos_update_date!: Date | null;

  @Column() tos_agreed?: boolean;

  @Column() ui_version!: string;

  @Column() brand!: Brand;

  constructor(order: Partial<Order>) {
    const data = {
      ...order,
      ea_order_number: null,
      create_date: new Date(),
      update_date: new Date(),
      last_print_attempt_date: null,
      last_print_success_date: null,
      print_attempts_count: 0,
      print_successes_count: 0,
      printible_type: 'card',
      print_attempts: [],
      print_successes: [],
      origin_api_version: process.env.APP_VERSION,
      fulfillment_date: null,
      ea_store_number: null
    };
    Object.assign(this, data);
  }
}
