import { ObjectId } from 'mongodb';
import { Brand } from 'src/_common/enums/brand.enum';
import { Order } from '../../_common/entities/order.entity';

const DATE_29_DAYS_AGO = new Date(Date.now() - 29 * 24 * 60 * 60 * 1001);
const DATE_80_DAYS_AGO = new Date(Date.now() - 80 * 24 * 60 * 60 * 1001);
const DATE_90_DAYS_AGO = new Date(Date.now() - 90 * 24 * 60 * 60 * 1001);
const DATE_95_DAYS_AGO = new Date(Date.now() - 99 * 24 * 60 * 60 * 1001);
const DATE_99_DAYS_AGO = new Date(Date.now() - 99 * 24 * 60 * 60 * 1001);

export const card = {
  id: 'VDay_B2',
  name: 'Valentines Day, Corgie Butt',
  type: 'portrait',
  attributes: [],
  category: ['valentines_day'],
  tags: ['valentines_day'],
  culture: ['en-US', 'en-CA', 'fr-CA'],
  font: {
    family: 'Roboto Slab',
    size: '14',
    weight: '500',
    color: '#000'
  },
  textarea_offset: {
    top: 653
  }
};

const sharedOrderContent = {
  referrer_url: '',
  client_ip: '::ffff:127.0.0.1',
  definition_id: 'VDay_B2',
  tos_agreed: true,
  printible_type: 'card',
  tos_update_date: null,
  origin_api_version: '',
  ui_version: '20210101.1',
  brand: Brand.Dcards
};

const getPrintAttempt = (time: Date) => ({
  store_number: '0000',
  employee_id: 'cron',
  time,
  client_ip: sharedOrderContent.client_ip
});

export const notPrintedOrder: Order = {
  ...sharedOrderContent,
  _id: new ObjectId('5fe31520b531013abb4bbe61'),
  customer_text: 'Happy notPrintedOrder testing',
  definition_id: 'VDay_B2',
  ea_order_number: null,
  ea_store_number: null,
  fulfillment_date: null,
  create_date: DATE_29_DAYS_AGO,
  update_date: DATE_29_DAYS_AGO,
  last_print_attempt_date: null,
  last_print_success_date: null,
  print_attempts_count: 0,
  print_successes_count: 0,
  print_attempts: [],
  print_successes: []
};

export const notPrintedObsoleteOrder: Order = {
  ...sharedOrderContent,
  _id: new ObjectId('5fe31520b531013abb4bbe62'),
  customer_text: 'Happy notPrintedObsoleteOrder testing',
  definition_id: 'VDay_B2',
  ea_order_number: null,
  ea_store_number: null,
  fulfillment_date: null,
  create_date: DATE_90_DAYS_AGO,
  update_date: DATE_90_DAYS_AGO,
  last_print_attempt_date: null,
  last_print_success_date: null,
  print_attempts_count: 0,
  print_successes_count: 0,
  print_attempts: [],
  print_successes: []
};

export const notPrintedFulfilledObsoleteOrder: Order = {
  ...sharedOrderContent,
  _id: new ObjectId('5fe31520b531013abb4bbe63'),
  customer_text: 'Happy notPrintedFulfilledObsoleteOrder testing',
  definition_id: 'VDay_B2',
  ea_order_number: '3434',
  ea_store_number: '4343',
  fulfillment_date: DATE_90_DAYS_AGO,
  create_date: DATE_99_DAYS_AGO,
  update_date: DATE_99_DAYS_AGO,
  last_print_attempt_date: null,
  last_print_success_date: null,
  print_attempts_count: 0,
  print_successes_count: 0,
  print_attempts: [],
  print_successes: []
};

export const notPrintedFulfilledOrder: Order = {
  ...sharedOrderContent,
  _id: new ObjectId('5fe31520b531013abb4bbe64'),
  customer_text: 'Happy notPrintedFulfilledOrder testing',
  definition_id: 'VDay_B2',
  ea_order_number: '3434',
  ea_store_number: '4343',
  fulfillment_date: DATE_80_DAYS_AGO,
  create_date: DATE_99_DAYS_AGO,
  update_date: DATE_99_DAYS_AGO,
  last_print_attempt_date: null,
  last_print_success_date: null,
  print_attempts_count: 0,
  print_successes_count: 0,
  print_attempts: [],
  print_successes: []
};

export const notPrintedAbandonedOrder: Order = {
  ...sharedOrderContent,
  _id: new ObjectId('5fe31520b531013abb4bbe65'),
  customer_text: 'Happy notPrintedOrder testing',
  definition_id: 'VDay_B2',
  ea_order_number: null,
  ea_store_number: null,
  fulfillment_date: null,
  create_date: DATE_80_DAYS_AGO,
  update_date: DATE_80_DAYS_AGO,
  last_print_attempt_date: null,
  last_print_success_date: null,
  print_attempts_count: 0,
  print_successes_count: 0,
  print_attempts: [],
  print_successes: []
};

// not obsoleted since printed < 90 days ago
// despite created > 90 days ago
export const printedOrder: Order = {
  ...sharedOrderContent,
  _id: new ObjectId('5fe31520b531013abb4bbe72'),
  customer_text: 'Happy printedOrder testing',
  ea_order_number: null,
  ea_store_number: null,
  fulfillment_date: null,
  create_date: DATE_99_DAYS_AGO,
  update_date: DATE_99_DAYS_AGO,
  last_print_attempt_date: DATE_80_DAYS_AGO,
  last_print_success_date: DATE_80_DAYS_AGO,
  print_attempts_count: 1,
  print_successes_count: 1,
  print_attempts: [getPrintAttempt(DATE_80_DAYS_AGO)],
  print_successes: [getPrintAttempt(DATE_80_DAYS_AGO)]
};

export const printedPaidNotFulfilledOrder: Order = {
  ...sharedOrderContent,
  _id: new ObjectId('5fe31520b531013abb4bbe71'),
  customer_text: 'Happy printedObsoleteOrder testing',
  ea_order_number: '3434',
  ea_store_number: '3434',
  fulfillment_date: null,
  create_date: DATE_99_DAYS_AGO,
  update_date: DATE_99_DAYS_AGO,
  last_print_attempt_date: DATE_90_DAYS_AGO,
  last_print_success_date: DATE_90_DAYS_AGO,
  print_attempts_count: 1,
  print_successes_count: 1,
  print_attempts: [getPrintAttempt(DATE_90_DAYS_AGO)],
  print_successes: [getPrintAttempt(DATE_90_DAYS_AGO)]
};

// not obsoleted since fulfilled < 90 days ago
// despite printed-n-created > 90 days ago
export const fulfilledPrintedOrder: Order = {
  ...sharedOrderContent,
  _id: new ObjectId('5fe31520b531013abb4bbe80'),
  customer_text: 'Happy fulfilledPrintedOrder testing',
  ea_order_number: '3434',
  ea_store_number: '4343',
  fulfillment_date: DATE_80_DAYS_AGO,
  create_date: DATE_99_DAYS_AGO,
  update_date: DATE_99_DAYS_AGO,
  last_print_attempt_date: DATE_90_DAYS_AGO,
  last_print_success_date: DATE_90_DAYS_AGO,
  print_attempts_count: 1,
  print_successes_count: 1,
  print_attempts: [getPrintAttempt(DATE_90_DAYS_AGO)],
  print_successes: [getPrintAttempt(DATE_90_DAYS_AGO)]
};

export const fulfilledPrintedObsoletedOrder: Order = {
  ...sharedOrderContent,
  _id: new ObjectId('5fe31520b531013abb4bbe81'),
  customer_text: 'Happy fulfilledPrintedObsoletedOrder testing',
  ea_order_number: '3434',
  ea_store_number: '4343',
  fulfillment_date: DATE_90_DAYS_AGO,
  create_date: DATE_99_DAYS_AGO,
  update_date: DATE_99_DAYS_AGO,
  last_print_attempt_date: DATE_95_DAYS_AGO,
  last_print_success_date: DATE_95_DAYS_AGO,
  print_attempts_count: 1,
  print_successes_count: 1,
  print_attempts: [getPrintAttempt(DATE_95_DAYS_AGO)],
  print_successes: [getPrintAttempt(DATE_95_DAYS_AGO)]
};

export const fulfilledWithoutDatePrintedOrder: Order = {
  ...sharedOrderContent,
  _id: new ObjectId('5fe31520b531013abb4bbe82'),
  customer_text: 'Happy fulfilledPrintedOrder testing',
  ea_order_number: '3434',
  ea_store_number: '4343',
  fulfillment_date: new Date(0),
  create_date: DATE_99_DAYS_AGO,
  update_date: DATE_99_DAYS_AGO,
  last_print_attempt_date: DATE_90_DAYS_AGO,
  last_print_success_date: DATE_90_DAYS_AGO,
  print_attempts_count: 1,
  print_successes_count: 1,
  print_attempts: [getPrintAttempt(DATE_90_DAYS_AGO)],
  print_successes: [getPrintAttempt(DATE_90_DAYS_AGO)]
};
